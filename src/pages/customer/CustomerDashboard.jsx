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
    <main className="max-w-7xl mx-auto px-4 py-10" aria-labelledby="dashboard-title">
      <header className="mb-8">
        <h1 id="dashboard-title" className="text-3xl font-bold text-gray-900">
          Welcome back!
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your upcoming and previous bookings.
        </p>
      </header>

      {loading && <p role="status">Loading bookings...</p>}
      {error && <p className="text-red-600" role="alert">{error}</p>}

      {bookings.length > 0 ? (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Bookings list"
        >
          {bookings.map((booking) => {
            const nights =
              (new Date(booking.dateTo) - new Date(booking.dateFrom)) /
              (1000 * 60 * 60 * 24);
            const totalPrice = nights * (booking.venue?.price || 0);

            return (
              <article
                key={booking.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition-shadow p-4 flex flex-col justify-between h-full"
                role="group"
                aria-labelledby={`booking-${booking.id}`}
              >
                <div className="flex flex-col gap-4 h-full">
                  <img
                    src={booking.venue?.media?.[0]?.url || placeholderImage}
                    alt={
                      booking.venue?.media?.[0]?.alt ||
                      booking.venue?.name ||
                      "Venue image"
                    }
                    className="w-full h-48 object-cover rounded-md border"
                  />

                  <div className="flex-1 min-w-0">
                    <h2
                      id={`booking-${booking.id}`}
                      className="text-lg font-semibold text-gray-800 truncate"
                      title={booking.venue?.name}
                    >
                      {booking.venue?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {booking.venue?.location?.city},{" "}
                      {booking.venue?.location?.country}
                    </p>

                    <dl className="mt-2 text-sm text-gray-700 space-y-1">
                      <div>
                        <dt className="font-medium inline">Check-in:</dt>{" "}
                        <dd className="inline">
                          {new Date(booking.dateFrom).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium inline">Check-out:</dt>{" "}
                        <dd className="inline">
                          {new Date(booking.dateTo).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium inline">Guests:</dt>{" "}
                        <dd className="inline">{booking.guests}</dd>
                      </div>
                      {booking.venue?.price && (
                        <div>
                          <dt className="font-medium inline">Total Price:</dt>{" "}
                          <dd className="inline">${totalPrice}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <footer className="mt-4">
                    <p className="text-sm text-gray-500 italic mb-2">
                      Booking created on:{" "}
                      {new Date(booking.created).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/venues/${booking.venue?.id}`}
                      className="block w-full text-center text-sm font-semibold text-white bg-[#ff4123] rounded py-2 hover:bg-[#e1371c] focus:outline-none focus:ring-2 focus:ring-[#ff4123] focus:ring-offset-2"
                    >
                      View Venue
                    </Link>
                  </footer>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        !loading && (
          <p className="text-gray-700 text-center mt-10" role="status">
            No upcoming bookings found.
          </p>
        )
      )}
    </main>
  );
}
