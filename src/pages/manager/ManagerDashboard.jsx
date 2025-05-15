import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getVenuesByProfile, deleteVenue } from "../../services/venueService";
import VenueCard from "../../components/venues/VenueCard";

export default function ManagerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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


  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      await deleteVenue(id, user.accessToken, import.meta.env.VITE_API_KEY);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("❌ Error deleting venue: " + err.message);
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
    </main>
  );
}
