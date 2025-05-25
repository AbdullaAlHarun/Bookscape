import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 
  useEffect(() => {
    document.title = "BookScape | Register";

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", "Create your BookScape account and start booking or managing holiday venues.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Create your BookScape account and start booking or managing holiday venues.";
      document.head.appendChild(meta);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.toLowerCase().endsWith("@stud.noroff.no")) {
      setError("Email must end with @stud.noroff.no");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Registration failed");
      }

      setSuccess("🎉 Registration successful! Redirecting to login...");
      setForm({ name: "", email: "", password: "", venueManager: false });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 sm:p-8 border border-black rounded shadow-md"
          aria-label="Registration form"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Register for BookScape</h1>

          {error && (
            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-green-700 bg-green-50 border border-green-200 p-2 rounded text-sm" role="status">
              {success}
            </div>
          )}

          <label htmlFor="name" className="block font-medium mb-1">Username</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mb-4 p-2 border border-black rounded"
          />

          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full mb-1 p-2 border border-black rounded"
            aria-describedby="emailHelp"
          />
          <p id="emailHelp" className="text-sm text-gray-600 mb-4">
            Must use a <strong>@stud.noroff.no</strong> email.
          </p>

          <label htmlFor="password" className="block font-medium mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full mb-4 p-2 border border-black rounded"
          />

          <label className="inline-flex items-center mb-4">
            <input
              type="checkbox"
              name="venueManager"
              checked={form.venueManager}
              onChange={handleChange}
              className="mr-2"
            />
            Register as a Venue Manager
          </label>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
};

export default Register;
