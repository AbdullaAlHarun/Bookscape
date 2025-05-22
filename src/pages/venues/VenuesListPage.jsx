import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Fuse from "fuse.js";
import { getAllVenues } from "../../services/venueService";
import VenueCard from "../../components/venues/VenueCard";

export default function VenuesListPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError("");

      try {
        const { venues: data } = await getAllVenues();

        const location = searchParams.get("location")?.toLowerCase();
        const guests = parseInt(searchParams.get("guests")) || 1;

        const checkInRaw = searchParams.get("checkIn");
        const checkOutRaw = searchParams.get("checkOut");
        const checkIn = checkInRaw ? new Date(checkInRaw) : null;
        const checkOut = checkOutRaw ? new Date(checkOutRaw) : null;

        let filtered = data;

        // Fuzzy search
        if (location) {
          const fuse = new Fuse(data, {
            keys: ["location.city", "location.country", "name"],
            threshold: 0.3,
          });
          const fuseResults = fuse.search(location);
          filtered = fuseResults.map((r) => r.item);
        }

        // Guest filter
        filtered = filtered.filter((venue) => venue.maxGuests >= guests);

        // Date validation
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        const hasCheckIn = checkIn instanceof Date && !isNaN(checkIn);
        const hasCheckOut = checkOut instanceof Date && !isNaN(checkOut);

        if (hasCheckIn && hasCheckOut) {
          if (checkOut <= checkIn || checkIn < today) {
            setError("Invalid check-in/check-out dates.");
            setVenues([]);
            return;
          }
        }

        // Sorting
        switch (sortOption) {
          case "priceLow":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "priceHigh":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "newest":
          default:
            filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
            break;
        }

        setVenues(filtered);
      } catch (err) {
        console.error("❌ Error fetching venues:", err);
        setError("Something went wrong while loading venues.");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [searchParams, sortOption]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
     <div className="sticky top-0 z-20 bg-white py-4 mb-6 shadow-sm">
  <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4">
    <h1 className="text-2xl font-bold whitespace-nowrap">Search Results</h1>
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="border rounded px-3 py-2 text-sm"
    >
      <option value="newest">Sort: Newest</option>
      <option value="priceLow">Price: Low to High</option>
      <option value="priceHigh">Price: High to Low</option>
      <option value="rating">Rating: High to Low</option>
    </select>
  </div>
</div>


      {loading ? (
        <p className="text-gray-600">Loading venues...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : venues.length === 0 ? (
        <p className="text-gray-500">No venues match your search. Try different criteria.</p>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </main>
  );
}
