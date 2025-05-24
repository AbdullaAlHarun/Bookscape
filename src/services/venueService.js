const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

/* ───────────────────────────────────────────────
   1. GET all venues with pagination + bookings
   - Used for full search (NOT homepage)
─────────────────────────────────────────────── */
export const getAllVenuesWithBookings = async () => {
  let page = 1;
  const limit = 100;
  let allVenues = [];
  let isLastPage = false;

  while (!isLastPage) {
    const res = await fetch(`${API_BASE}/holidaze/venues?page=${page}&limit=${limit}&_bookings=true`);
    if (!res.ok) {
      throw new Error("Unable to fetch venues");
    }
    const json = await res.json();
    allVenues = [...allVenues, ...json.data];
    isLastPage = json.meta?.isLastPage || json.data.length === 0;
    page++;
  }

  return allVenues;
};

/* ───────────────────────────────────────────────
   2. GET venues by page (lightweight, homepage)
─────────────────────────────────────────────── */
export const getVenuesPage = async (page = 1, limit = 16) => {
  const res = await fetch(`${API_BASE}/holidaze/venues?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Unable to fetch venues");
  const json = await res.json();
  return {
    venues: json.data,
    totalCount: json.meta.totalCount,
  };
};

/* ───────────────────────────────────────────────
   3. Search venues with bookings (by keyword)
─────────────────────────────────────────────── */
export const searchVenuesWithBookings = async (query) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(query)}&_bookings=true`);
  if (!res.ok) throw new Error("Search request failed");
  const json = await res.json();
  return json.data;
};

/* ───────────────────────────────────────────────
   4. Basic search for suggestions
─────────────────────────────────────────────── */
export const searchVenues = async (query) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search request failed");
  const json = await res.json();
  return json.data;
};

/* ───────────────────────────────────────────────
   5. Get a single venue by ID (public)
─────────────────────────────────────────────── */
export const getVenueById = async (id) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`);
  if (!res.ok) throw new Error("Failed to fetch venue details");
  const json = await res.json();
  return json.data;
};

/* ───────────────────────────────────────────────
   6. Get venues by profile (protected)
─────────────────────────────────────────────── */
export const getVenuesByProfile = async (profileName) => {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
  const res = await fetch(`${API_BASE}/holidaze/profiles/${profileName}/venues?_owner=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch venues");
  }

  return json.data;
};

/* ───────────────────────────────────────────────
   7. Create a new venue (protected)
─────────────────────────────────────────────── */
export const createVenue = async (venueData, accessToken) => {
  const res = await fetch(`${API_BASE}/holidaze/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(venueData),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to create venue");
  }

  return json.data;
};

/* ───────────────────────────────────────────────
   8. Update a venue (protected)
─────────────────────────────────────────────── */
export const updateVenue = async (id, venueData, accessToken) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(venueData),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to update venue");
  }

  return json.data;
};

/* ───────────────────────────────────────────────
   9. Delete a venue (protected)
─────────────────────────────────────────────── */
export const deleteVenue = async (id, accessToken) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.errors?.[0]?.message || "Failed to delete venue");
  }
};
