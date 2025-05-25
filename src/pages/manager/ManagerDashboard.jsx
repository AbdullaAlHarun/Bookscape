import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getVenuesByProfile, deleteVenue } from "../../services/venueService";
import VenueCard from "../../components/venues/VenueCard";

export default function ManagerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingVenueId, setDeletingVenueId] = useState(null);

  useEffect(() => {
    if (!user || authLoading) return;

    const fetchVenues = async () => {
      try {
        const data = await getVenuesByProfile(user.name);
        setVenues(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load your venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
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
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Helmet>
        <title>BookScape | Your Venues</title>
        <meta name="description" content="Manage your listed venues and keep track of bookings on BookScape." />
      </Helmet>

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {deletingVenueId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60"
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
