import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Fuse from "fuse.js";
import { getAllVenuesWithBookings } from "../../services/venueService";

export default function SearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState("1");
  const timeoutRef = useRef(null);

  // Debounced suggestion loading
  useEffect(() => {
    if (location.length < 2) return setSuggestions([]);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const allVenues = await getAllVenuesWithBookings();
        const fuse = new Fuse(allVenues, {
          keys: ["name", "location.city", "location.country"],
          threshold: 0.3,
        });
        const results = fuse.search(location).map((r) => r.item.name);
        setSuggestions([...new Set(results)]);
      } catch (error) {
        console.error("Suggestion error:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    if (guests) params.set("guests", guests);
    navigate(`/venues?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 grid md:grid-cols-5 gap-4 max-w-5xl mx-auto"
    >
      {/* Location input with autosuggest */}
      <div className="relative">
        <label className="block text-sm font-medium">Where to?</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search city or venue"
          className="w-full border px-3 py-2 rounded"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
        />
        {suggestions.length > 0 && (
          <ul
            id="suggestions-list"
            className="absolute z-10 bg-white border mt-1 w-full max-h-40 overflow-y-auto rounded shadow"
          >
            {suggestions.map((item, i) => (
              <li
                key={i}
                onMouseDown={() => {
                  setLocation(item);
                  setSuggestions([]);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Check-in */}
      <div>
        <label className="block text-sm font-medium">Check-in</label>
        <DatePicker
          selected={checkIn}
          onChange={setCheckIn}
          placeholderText="Select"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Check-out */}
      <div>
        <label className="block text-sm font-medium">Check-out</label>
        <DatePicker
          selected={checkOut}
          onChange={setCheckOut}
          minDate={checkIn}
          placeholderText="Select"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-medium">Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          {[1, 2, 3, 4, 5, 6].map((g) => (
            <option key={g} value={g}>
              {g} {g === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <div className="flex items-end">
        <button
          type="submit"
          className="bg-[#ff4123] text-white px-6 py-2 rounded hover:bg-[#e1371c] w-full"
        >
          Search
        </button>
      </div>
    </form>
  );
}
