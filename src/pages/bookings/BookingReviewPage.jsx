import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import placeholderImage from "../../assets/placeholder.png";

export default function BookingReviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { venue, checkIn, checkOut, guests } = state || {};

  if (!venue || !checkIn || !checkOut || !guests) {
    return <p className="p-6 text-center text-red-500">Missing booking data.</p>;
  }

  const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  const subtotal = venue.price * nights;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleConfirm = () => {
    navigate(`/venues/${venue.id}/confirm`, {
      state: { venue, checkIn, checkOut, guests }
    });
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Review Your Booking</h1>

      <div className="border rounded-lg p-6 shadow space-y-4">
        <div className="flex gap-4 items-start">
          <img
            src={venue.media?.[0]?.url || placeholderImage}
            alt={venue.media?.[0]?.alt || venue.name}
            className="w-28 h-20 object-cover rounded"
          />
          <div>
            <h2 className="text-lg font-semibold">{venue.name}</h2>
            <p className="text-gray-600 text-sm">
              {venue.location?.address}, {venue.location?.city}, {venue.location?.country}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> {guests}</p>
        </div>

        <div className="text-sm text-gray-700 mt-4">
          <h3 className="font-semibold mb-2">Price Breakdown</h3>
          <p>💲 {venue.price} × {nights} nights = ${subtotal.toFixed(2)}</p>
          <p>🔧 Service Fee (10%) = ${serviceFee.toFixed(2)}</p>
          <p className="mt-2 font-bold text-lg">Total: ${total.toFixed(2)}</p>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 mt-6 rounded"
        >
          Confirm Booking
        </button>
      </div>
    </main>
  );
}
