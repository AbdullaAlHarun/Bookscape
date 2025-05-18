import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllVenues } from "../../services/venueService";
import VenueCard from "../../components/venues/VenueCard";

export default function VenuesListPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchAndFilterVenues = async () => {
      setLoading(true);
      setError("");

      try {
        const { venues: data } = await getAllVenues(); // ✅ using destructuring
        const location = searchParams.get("location")?.toLowerCase();
        const guests = parseInt(searchParams.get("guests")) || 1;

        const filtered = data.filter((venue) => {
          const matchesLocation = location
            ? venue.location.city?.toLowerCase().includes(location) ||
              venue.location.country?.toLowerCase().includes(location)
            : true;

          const matchesGuests = guests ? venue.maxGuests >= guests : true;

          return matchesLocation && matchesGuests;
        });

        setVenues(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch venues", err);
        setError("Something went wrong while loading venues.");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterVenues();
  }, [searchParams]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Available Venues</h1>

      {loading ? (
        <p className="text-gray-600">Loading venues...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : venues.length === 0 ? (
        <p className="text-gray-500">No venues match your search criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </main>
  );
}
