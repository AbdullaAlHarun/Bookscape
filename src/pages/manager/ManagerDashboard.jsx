import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVenuesByProfile } from "../../services/venueService";
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

  if (authLoading || loading) {
    return <p className="text-center py-8">Loading your venues...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-600">{error}</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Your Venues ({venues.length})
      </h1>

      {venues.length === 0 ? (
        <p>You haven’t created any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </main>
  );
}
