import React, { useEffect, useState } from "react";
import { getBookingsByProfile } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import placeholderImage from "../../assets/placeholder.png";


export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByProfile(user.name);
        setBookings(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.name) {
      fetchBookings();
    }
  }, [user]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {bookings.length > 0 ? (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-lg shadow p-6 flex flex-col md:flex-row gap-4 justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={booking.venue?.media?.[0]?.url || placeholderImage}
                  alt={booking.venue?.name}
                  className="w-24 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-semibold">{booking.venue?.name}</h2>
                  <p className="text-sm text-gray-600">
                    {booking.venue?.location?.city}, {booking.venue?.location?.country}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Check-in:</strong> {new Date(booking.dateFrom).toLocaleDateString()} <br />
                    <strong>Check-out:</strong> {new Date(booking.dateTo).toLocaleDateString()} <br />
                    <strong>Guests:</strong> {booking.guests}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Link
                  to={`/bookings/${booking.id}/edit`}
                  className="text-orange-600 hover:underline font-semibold"
                >
                  Edit Booking
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No upcoming bookings found.</p>
      )}
    </main>
  );
}