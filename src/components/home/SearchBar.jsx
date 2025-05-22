import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllVenues } from "../../services/venueService";
import Fuse from "fuse.js";

export default function SearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState("1");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { venues } = await getAllVenues();
        const uniqueLocations = Array.from(
          new Set(
            venues.flatMap((v) => [v.location.city, v.location.country].filter(Boolean))
          )
        );
        const fuse = new Fuse(uniqueLocations, {
          includeScore: true,
          threshold: 0.3,
        });
        if (location.length > 1) {
          const results = fuse.search(location).map((res) => res.item);
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching venue suggestions", err);
      }
    };
    fetchSuggestions();
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (location) params.append("location", location.trim());
    if (checkIn) params.append("checkIn", checkIn.toISOString());
    if (checkOut) params.append("checkOut", checkOut.toISOString());
    if (guests) params.append("guests", guests);

    navigate(`/venues?${params.toString()}`);
  };

  const handleSelectSuggestion = (value) => {
    setLocation(value);
    setSuggestions([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl px-6 py-4 md:py-6 w-full max-w-5xl mx-auto grid md:grid-cols-5 gap-4 items-end relative"
    >
      {/* Location */}
      <div className="flex flex-col relative">
        <label className="text-sm font-medium mb-1 text-[#1e1e1e]">Where to?</label>
        <input
          type="text"
          placeholder="Search location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          required
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 top-full mt-1 bg-white border border-gray-300 rounded shadow w-full max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Check-in */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-[#1e1e1e]">Check-in</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          placeholderText="Select date"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Check-out */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-[#1e1e1e]">Check-out</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn}
          placeholderText="Select date"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Guests */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-[#1e1e1e]">Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4+ Guests</option>
        </select>
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="w-full bg-[#ff4123] text-white font-semibold px-6 py-2 rounded hover:bg-[#e1371c] transition"
        >
          Search
        </button>
      </div>
    </form>
  );
}
