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
        const checkIn = new Date(searchParams.get("checkIn"));
        const checkOut = new Date(searchParams.get("checkOut"));

        let filtered = data;
        if (location) {
          const fuse = new Fuse(data, {
            keys: ["location.city", "location.country", "name"],
            threshold: 0.3,
          });
          const fuseResults = fuse.search(location);
          filtered = fuseResults.map((r) => r.item);
        }

        filtered = filtered.filter((venue) => venue.maxGuests >= guests);

        const today = new Date();
        if (
          checkIn.toString() !== "Invalid Date" &&
          checkOut.toString() !== "Invalid Date"
        ) {
          if (checkOut <= checkIn || checkIn < today) {
            setError("Invalid check-in/check-out dates.");
            setVenues([]);
            return;
          }
        }

        if (sortOption === "priceLow") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === "priceHigh") {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === "rating") {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === "newest") {
          filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2 sm:px-0">
          <h1 className="text-2xl font-bold">Search Results</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </main>
  );
}
