const API_BASE = "https://v2.api.noroff.dev";

export const getAllVenues = async () => {
  const url = `${API_BASE}/holidaze/venues?_bookings=false&_owner=false`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Unable to fetch venues");
  }

  const json = await res.json();
  return json.data;
};
