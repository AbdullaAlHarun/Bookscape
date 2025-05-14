import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <h1 className="text-6xl font-bold text-[#ff4123] mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Sorry, the page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}
