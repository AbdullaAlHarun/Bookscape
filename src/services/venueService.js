const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

//  1. Get all venues (public)
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

//  2. Get single venue details (public)
export const getVenueById = async (id) => {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch venue details");
  }
  const json = await res.json();
  return json.data;
};

//  3. Get venues by profile (protected)
export async function getVenuesByProfile(profileName) {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;

  const res = await fetch(
    `${API_BASE}/holidaze/profiles/${profileName}/venues`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to fetch venues");
  }

  return data.data;
}
