const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

// Create a booking
export async function createBooking(bookingData) {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;

  const res = await fetch(`${API_BASE}/holidaze/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(bookingData),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Booking failed");
  }

  return json.data;
}

// Get bookings by profile
export async function getBookingsByProfile(profileName) {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;

  const res = await fetch(
    `${API_BASE}/holidaze/profiles/${profileName}/bookings?_customer=true&_venue=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    }
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch bookings");
  }

  return json.data;
}
