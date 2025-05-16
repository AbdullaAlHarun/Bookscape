import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVenuesByProfile } from "../../services/venueService";
import VenueCard from "../venues/VenueCard";

export default function ManagedVenuesSection() {
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
    return <p className="text-center py-4">Loading your venues...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center py-4">{error}</p>;
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Venues ({venues.length})
      </h2>

      {venues.length === 0 ? (
        <p className="text-gray-600">You haven’t created any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </section>
  );
}
