import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllVenuesWithBookings } from "../../services/venueService";
import VenueCard from "../../components/venues/VenueCard";

export default function VenuesListPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("newest");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");

      try {
        const location = searchParams.get("location")?.toLowerCase() || "";
        const guests = parseInt(searchParams.get("guests")) || 1;
        const checkIn = searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")) : null;
        const checkOut = searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")) : null;

        if (checkIn && checkOut && checkOut <= checkIn) {
          setError("❌ Check-out must be after check-in.");
          setVenues([]);
          return;
        }

        const results = await getAllVenuesWithBookings();
        let filtered = results;

        if (location) {
          filtered = filtered.filter((v) =>
            (v.location?.city?.toLowerCase().includes(location)) ||
            (v.location?.country?.toLowerCase().includes(location)) ||
            (v.name?.toLowerCase().includes(location))
          );
        }

        filtered = filtered.filter((v) => v.maxGuests >= guests);

        if (checkIn && checkOut) {
          filtered = filtered.filter((v) =>
            v.bookings.every((b) => {
              const from = new Date(b.dateFrom);
              const to = new Date(b.dateTo);
              return to <= checkIn || from >= checkOut;
            })
          );
        }

        switch (sort) {
          case "priceLow":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "priceHigh":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          default:
            filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
            break;
        }

        setVenues(filtered);
      } catch (err) {
        console.error("Search failed", err);
        setError("Failed to load venues");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [searchParams, sort]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="newest">Newest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {loading ? (
        <p>Loading venues...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : venues.length === 0 ? (
        <p>No venues found for your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((v, index) => (
            <VenueCard key={`${v.id}-${index}`} venue={v} />
          ))}
        </div>
      )}
    </main>
  );
}
