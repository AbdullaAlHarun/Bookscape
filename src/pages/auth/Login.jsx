import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNoroffEmail = email.toLowerCase().endsWith("@stud.noroff.no");
    if (!isNoroffEmail) {
      setError("Only @stud.noroff.no emails are allowed.");
      return;
    }

    try {
      const userData = await loginUser({ email, password });
      login(userData);
      setError("");

      if (userData.venueManager) {
        navigate("/manager");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 border rounded-lg shadow-md"
        aria-label="Login form"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login to BookScape</h1>

        <label htmlFor="email" className="block mb-2 font-medium">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-black"
        />

        <label htmlFor="password" className="block mt-4 mb-2 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-black"
        />

        {error && (
          <div
            className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-black text-white p-2 rounded hover:bg-gray-800 transition"
        >
          Log In
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register Now
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
