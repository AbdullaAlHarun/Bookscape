import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getVenueById } from "../../services/venueService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const initFormStateFromURL = () => {
      const checkInParam = searchParams.get("checkIn");
      const checkOutParam = searchParams.get("checkOut");
      const guestsParam = searchParams.get("guests");

      if (checkInParam) {
        const parsed = new Date(checkInParam);
        if (!isNaN(parsed)) setCheckIn(parsed);
      }
      if (checkOutParam) {
        const parsed = new Date(checkOutParam);
        if (!isNaN(parsed)) setCheckOut(parsed);
      }
      if (guestsParam) {
        const parsedGuests = parseInt(guestsParam);
        if (!isNaN(parsedGuests)) setGuests(parsedGuests);
      }
    };

    initFormStateFromURL();
  }, [searchParams]);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const data = await getVenueById(id);
        setVenue(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load venue.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkIn || !checkOut || guests < 1) {
      return setError("Please fill all fields properly.");
    }
    if (checkOut <= checkIn || checkIn < today) {
      return setError("Invalid check-in/check-out dates.");
    }

    // Redirect to review page
    navigate(`/venues/${id}/review`, {
      state: {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        venue,
      },
    });
  };

  if (loading) return <p className="p-8 text-center">Loading venue info...</p>;
  if (!venue) return <p className="p-8 text-red-500 text-center">Venue not found.</p>;

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Book: {venue.name}</h1>

      <form onSubmit={handleSubmit} className="space-y-5 border p-6 rounded-lg shadow">
        <div>
          <label className="block mb-1 font-medium">Check-in</label>
          <DatePicker
            selected={checkIn}
            onChange={setCheckIn}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            placeholderText="Select check-in date"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Check-out</label>
          <DatePicker
            selected={checkOut}
            onChange={setCheckOut}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn}
            placeholderText="Select check-out date"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Guests</label>
          <input
            type="number"
            value={guests}
            min={1}
            max={venue.maxGuests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded"
        >
          Continue to Review
        </button>
      </form>
    </main>
  );
}
