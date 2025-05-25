import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import placeholderImage from "../../assets/placeholder.png";
import { createBooking } from "../../services/bookingService";

export default function BookingConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { venue, checkIn, checkOut, guests } = state || {};

  useEffect(() => {
    if (venue && checkIn && checkOut) {
      document.title = `BookScape | Confirm Booking for ${venue.name}`;
    } else {
      document.title = "BookScape | Booking Error";
    }
  }, [venue, checkIn, checkOut]);

  if (!venue || !checkIn || !checkOut || !guests) {
    return (
      <p className="p-6 text-center text-red-600">
        Missing booking details. Please return and try again.
      </p>
    );
  }

  const nights =
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  const subtotal = venue.price * nights;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleBooking = async () => {
    const guestsNum = parseInt(guests, 10);
    if (guestsNum > venue.maxGuests) {
      toast.error(`This venue allows up to ${venue.maxGuests} guests.`);
      return;
    }

    const checkStart = new Date(checkIn);
    const checkEnd = new Date(checkOut);

    const hasConflict = venue.bookings?.some((booking) => {
      const existingStart = new Date(booking.dateFrom);
      const existingEnd = new Date(booking.dateTo);
      return checkStart < existingEnd && checkEnd > existingStart;
    });

    if (hasConflict) {
      toast.error("Selected dates overlap with an existing booking.");
      return;
    }

    try {
      await createBooking({
        venueId: venue.id,
        dateFrom: checkStart.toISOString(),
        dateTo: checkEnd.toISOString(),
        guests: guestsNum,
      });
      toast.success("Booking successful! 🎉");
      navigate("/customer");
    } catch (err) {
      if (err.message?.includes("409")) {
        toast.error("These dates are already booked. Please pick different dates.");
      } else {
        toast.error(err.message || "Booking failed");
      }
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Review & Confirm Your Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Venue Info */}
        <section className="border rounded-lg shadow p-6 space-y-4" aria-label="Venue information">
          <img
            src={venue.media?.[0]?.url || placeholderImage}
            alt={venue.media?.[0]?.alt || venue.name}
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="text-xl font-semibold">{venue.name}</h2>
          <p className="text-gray-600">
            {venue.location?.address}, {venue.location?.city},{" "}
            {venue.location?.country}
          </p>
          <ul className="text-sm text-gray-700 space-y-1 pt-2">
            <li><strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString()}</li>
            <li><strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString()}</li>
            <li><strong>Guests:</strong> {guests}</li>
            <li><strong>Nights:</strong> {nights}</li>
          </ul>
        </section>

        {/* Price Summary */}
        <section className="border rounded-lg shadow p-6 space-y-6 bg-white" aria-label="Price summary">
          <h3 className="text-lg font-semibold border-b pb-2">Price Breakdown</h3>
          <div className="space-y-2 text-sm text-gray-800">
            <p>💲 {venue.price} × {nights} nights = <strong>${subtotal.toFixed(2)}</strong></p>
            <p>🔧 Service Fee (10%) = <strong>${serviceFee.toFixed(2)}</strong></p>
          </div>

          <div className="border-t pt-4 text-xl font-bold text-gray-900">
            Total: ${total.toFixed(2)}
          </div>

          <button
            onClick={handleBooking}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded transition"
          >
            Confirm Booking
          </button>
        </section>
      </div>
    </main>
  );
}
