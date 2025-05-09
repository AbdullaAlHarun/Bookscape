import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const isNoroffEmail = email.toLowerCase().endsWith("@stud.noroff.no");

    if (!isNoroffEmail) {
      setError("Only @stud.noroff.no emails are allowed.");
      return;
    }

    setError("");
    console.log("Logging in:", email, password);

    // TODO: Add API logic here
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <section
        className="w-full max-w-md p-6 border border-black rounded-lg shadow-md"
        aria-label="Login panel"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login to BookScape</h1>

        {error && (
          <div
            className="bg-red-100 text-red-800 border border-red-400 p-2 rounded text-sm mb-4"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login form">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-xs text-gray-600 mt-1">
              Use your <strong>@stud.noroff.no</strong> email
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Log In
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
