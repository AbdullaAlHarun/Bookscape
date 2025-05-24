const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

// Helper: get token from local storage
function getAuthHeaders() {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };
}

// Create a booking
export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/holidaze/bookings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Booking failed");
  }

  return json.data;
}

// Get bookings by profile (for customers)
export async function getBookingsByProfile(profileName) {
  const res = await fetch(
    `${API_BASE}/holidaze/profiles/${profileName}/bookings?_customer=true&_venue=true`,
    {
      headers: getAuthHeaders(),
    }
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch bookings");
  }

  return json.data;
}

//  Get all bookings (for venue managers)
export async function getAllBookings() {
  const res = await fetch(
    `${API_BASE}/holidaze/bookings?_venue=true`,
    {
      headers: getAuthHeaders(),
    }
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch bookings");
  }

  return json.data;
}
