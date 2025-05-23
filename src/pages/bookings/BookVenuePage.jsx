import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getVenueById } from "../../services/venueService";
import placeholderImage from "../../assets/placeholder.png";
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
    const initForm = () => {
      const inDate = searchParams.get("checkIn");
      const outDate = searchParams.get("checkOut");
      const guestsParam = searchParams.get("guests");

      if (inDate) setCheckIn(new Date(inDate));
      if (outDate) setCheckOut(new Date(outDate));
      if (guestsParam) setGuests(parseInt(guestsParam));
    };
    initForm();
  }, [searchParams]);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const data = await getVenueById(id);
        setVenue(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load venue data.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const handleReview = (e) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut || guests < 1) {
      return setError("Please complete all fields.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today || checkOut <= checkIn) {
      return setError("Please choose valid dates.");
    }

    navigate(`/bookings/${venue.id}/confirm`, {
      state: {
        venue,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
      },
    });
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!venue) return <p className="text-center text-red-600">Venue not found.</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <img
            src={venue.media?.[0]?.url || placeholderImage}
            alt={venue.name}
            className="rounded-xl w-full h-64 object-cover"
          />
          <h1 className="text-2xl font-bold mt-4">{venue.name}</h1>
          <p className="text-sm text-gray-600">
            {venue.location?.city}, {venue.location?.country}
          </p>
          <p className="mt-2 text-orange-600 font-semibold text-lg">
            ${venue.price} <span className="text-sm font-normal">/ night</span>
          </p>
        </div>

        <form onSubmit={handleReview} className="space-y-5 border p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Book this venue</h2>
          <div>
            <label className="block text-sm font-medium">Check-in</label>
            <DatePicker
              selected={checkIn}
              onChange={setCheckIn}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              placeholderText="Select check-in"
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Check-out</label>
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn}
              placeholderText="Select check-out"
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Guests</label>
            <input
              type="number"
              min={1}
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 font-bold rounded"
          >
            Continue to Review
          </button>
        </form>
      </div>
    </main>
  );
}
