import { useAuth } from "../../context/AuthContext";

export default function ProfileDashboard() {
  const { user, isVenueManager, isCustomer } = useAuth();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <section className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar?.url || "https://i.pravatar.cc/100"}
            alt={user?.avatar?.alt || user?.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </section>

      {/* Role-Based Content */}
      {isVenueManager && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Your Venues</h2>
          <p className="text-gray-600 mb-4">Create and manage your listings</p>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            + Create New Venue
          </button>
          {/* Later: Add list of venues here */}
        </section>
      )}

      {isCustomer && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
          <p className="text-gray-600">See and manage your upcoming bookings</p>
          {/* Later: Add booking list here */}
        </section>
      )}
    </main>
  );
}
