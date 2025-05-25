import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getVenuesByProfile, deleteVenue } from "../../services/venueService";
import { getAllBookingsPaginated } from "../../services/bookingService";
import VenueCard from "../../components/venues/VenueCard";

export default function ManagerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingVenueId, setDeletingVenueId] = useState(null);
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    document.title = "BookScape | Your Venues";
  }, []);

  useEffect(() => {
    if (!user || authLoading) return;

    const fetchData = async () => {
      try {
        const [venuesData, bookingsData] = await Promise.all([
          getVenuesByProfile(user.name),
          getAllBookingsPaginated(),
        ]);
        setVenues(venuesData);
        setAllBookings(bookingsData);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load your venues or bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const handleDelete = (id) => {
    setDeletingVenueId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteVenue(deletingVenueId, user.accessToken);
      setVenues((prev) => prev.filter((v) => v.id !== deletingVenueId));
    } catch (err) {
      alert("❌ Error deleting venue: " + err.message);
    } finally {
      setDeletingVenueId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <p className="text-center py-8 flex items-center justify-center gap-2" role="status">
        <span className="animate-spin h-5 w-5 border-2 border-gray-700 border-t-transparent rounded-full"></span>
        Loading your venues...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center py-8 text-red-600" role="alert">
        {error}
      </p>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Venues ({venues.length})</h1>
        <Link
          to="/manager/create"
          className="bg-[#ff4123] text-white px-6 py-2 rounded hover:bg-[#e1371c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4123]"
        >
          + Create New Venue
        </Link>
      </section>

      {venues.length === 0 ? (
        <p className="text-gray-600">You haven’t created any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.map((venue) => {
            const venueBookings = allBookings.filter(
              (booking) => booking.venue?.id === venue.id
            );

            return (
              <div key={venue.id} className="bg-white border rounded-xl shadow-md p-4">
                <VenueCard venue={venue} onDelete={handleDelete} />

                <div className="mt-4 text-sm bg-gray-50 border border-gray-200 rounded-lg p-3" aria-labelledby={`venue-${venue.id}-bookings`}>
                  <h3 id={`venue-${venue.id}-bookings`} className="font-semibold text-gray-800 mb-2">📅 Bookings:</h3>
                  {venueBookings.length === 0 ? (
                    <p className="text-gray-500 italic">No bookings yet.</p>
                  ) : (
                    <ul className="space-y-1">
                      {venueBookings.map((b) => (
                        <li key={b.id} className="flex justify-between text-gray-700">
                          <span>{new Date(b.dateFrom).toLocaleDateString()} → {new Date(b.dateTo).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">{b.guests} guest{b.guests > 1 ? 's' : ''}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deletingVenueId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-venue-title"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 id="delete-venue-title" className="text-lg font-semibold text-gray-900">
              Delete Venue?
            </h2>
            <p className="text-gray-600 text-sm mt-2 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingVenueId(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}