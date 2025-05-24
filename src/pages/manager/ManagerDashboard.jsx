import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getVenuesByProfile, deleteVenue } from "../../services/venueService";
import { getAllBookings } from "../../services/bookingService";
import VenueCard from "../../components/venues/VenueCard";

export default function ManagerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingVenueId, setDeletingVenueId] = useState(null);

  useEffect(() => {
    if (!user || authLoading) return;

    const fetchData = async () => {
      try {
        const [venuesData, bookingsData] = await Promise.all([
          getVenuesByProfile(user.name),
          getAllBookings("?_venue=true")
        ]);

        setVenues(venuesData);

        const filteredBookings = bookingsData.filter(
          (booking) => booking.venue?.owner?.name === user.name
        );
        setBookings(filteredBookings);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load your venues or bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const handleDelete = async (id) => {
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
    return <p className="text-center py-8">Loading your venues...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-600">{error}</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <section className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Your Venues ({venues.length})
        </h1>
        <Link
          to="/manager/create"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          + Create New Venue
        </Link>
      </section>

      {venues.length === 0 ? (
        <p className="text-gray-600">You haven’t created any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upcoming Bookings at Your Venues ({bookings.length})
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No upcoming bookings found.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
              >
                <p className="font-semibold text-gray-900">
                  {booking.venue?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Check-in: {new Date(booking.dateFrom).toLocaleDateString()} | Guests: {booking.guests}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {deletingVenueId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 className="text-lg font-semibold text-gray-900">Delete Venue?</h2>
            <p className="text-gray-600 text-sm mt-2 mb-4">This action cannot be undone.</p>
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
