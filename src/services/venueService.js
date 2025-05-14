const API_BASE = "https://v2.api.noroff.dev";

export const getAllVenues = async (page = 1, limit = 8) => {
  const res = await fetch(
    `${API_BASE}/holidaze/venues?limit=${limit}&page=${page}`
  );
  if (!res.ok) {
    throw new Error("Unable to fetch venues");
  }
  const json = await res.json();
  return {
    venues: json.data,
    totalCount: json.meta.totalCount,
  };
};

// ✅ New function for venue details
export const getVenueById = async (id) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch venue details");
  }
  const json = await res.json();
  return json.data;
};
