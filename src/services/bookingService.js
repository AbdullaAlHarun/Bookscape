const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

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

// Get all bookings for a customer (used on customer dashboard)
export async function getBookingsByProfile(profileName) {
  const res = await fetch(
    `${API_BASE}/holidaze/profiles/${profileName}/bookings?_customer=true&_venue=true`,
    { headers: getAuthHeaders() }
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch bookings");
  }

  return json.data;
}

// Get all bookings with venue + customer info (used on manager dashboard)
export async function getAllBookings() {
  const res = await fetch(
    `${API_BASE}/holidaze/bookings?_venue=true&_customer=true`,
    { headers: getAuthHeaders() }
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch all bookings");
  }

  return json.data;
}

// Get all bookings across all pages (for manager dashboard only)
export async function getAllBookingsPaginated() {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  let page = 1;
  const limit = 100;
  let allBookings = [];
  let isLastPage = false;

  while (!isLastPage) {
    const res = await fetch(
      `${API_BASE}/holidaze/bookings?page=${page}&limit=${limit}&_venue=true&_customer=true`,
      { headers }
    );

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed to fetch paginated bookings");
    }

    allBookings = [...allBookings, ...json.data];
    isLastPage = json.meta?.isLastPage || json.data.length === 0;
    page++;
  }

  return allBookings;
}