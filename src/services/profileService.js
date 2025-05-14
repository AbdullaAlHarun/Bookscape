const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export async function updateUserAvatar(name, avatarUrl) {
  const token = JSON.parse(localStorage.getItem("user"))?.accessToken;

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch(`${API_BASE}/holidaze/profiles/${name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY, // ✅ Secure and dynamic
    },
    body: JSON.stringify({
      avatar: {
        url: avatarUrl,
        alt: `${name}'s avatar`,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to update avatar");
  }

  return data.data.avatar;
}
