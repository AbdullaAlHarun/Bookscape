const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

// ✅ 1. Get all venues (public)
export const getAllVenues = async (page = 1, limit = 8) => {
  const res = await fetch(`${API_BASE}/holidaze/venues?limit=${limit}&page=${page}`);
  if (!res.ok) {
    throw new Error("Unable to fetch venues");
  }
  const json = await res.json();
  return {
    venues: json.data,
    totalCount: json.meta.totalCount,
  };
};

// ✅ 2. Get single venue details (public)
export const getVenueById = async (id) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch venue details");
  }
  const json = await res.json();
  return json.data;
};

// ✅ 3. Get venues by profile (protected)
export const getVenuesByProfile = async (profileName) => {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
  const res = await fetch(`${API_BASE}/holidaze/profiles/${profileName}/venues`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to fetch venues by profile");
  }

  return data.data;
};

// ✅ 4. Create venue (protected)
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to create venue");
  }

  return data.data;
};

// ✅ 5. Delete venue (protected)
export const deleteVenue = async (id, accessToken) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.[0]?.message || "Failed to delete venue");
  }
};
