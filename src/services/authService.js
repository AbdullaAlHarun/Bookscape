const API_BASE = "https://v2.api.noroff.dev";

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login?_holidaze=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || "Login failed");
    }

    return result.data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
}
