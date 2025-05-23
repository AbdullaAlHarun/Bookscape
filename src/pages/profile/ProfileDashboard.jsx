import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUserAvatar } from "../../services/profileService";
import { uploadImageToImgBB } from "../../services/profileUploader";
import ManagedVenuesSection from "../../components/profile/ManagedVenuesSection";
import { Link } from "react-router-dom";

export default function ProfileDashboard() {
  const { user, updateAvatar } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0]);
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      setStatus("Uploading...");

      const imageUrl = await uploadImageToImgBB(selectedFile);
      const updated = await updateUserAvatar(user.name, imageUrl);
      updateAvatar(updated);

      setStatus("✅ Avatar updated!");
    } catch (error) {
      setStatus("❌ Failed: " + error.message);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <section
        className="bg-[#fff8f4] p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center md:items-start gap-8"
        aria-labelledby="profile-info-heading"
      >
        <div className="flex-shrink-0">
          <img
            src={user?.avatar?.url || `https://i.pravatar.cc/150?u=${user?.email}`}
            alt={user?.avatar?.alt || `${user?.name}'s avatar`}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#ff4123] shadow-md"
          />
        </div>

        <div className="flex-1">
          <h1
            id="profile-info-heading"
            className="text-3xl font-extrabold text-gray-900"
          >
            {user?.name}
          </h1>
          <p className="text-gray-700 mt-1">{user?.email}</p>
          <p className="text-sm text-gray-600 mt-1">
            Role: {user?.venueManager ? "Venue Manager 🏨" : "Customer 🎓"}
          </p>

          <form className="mt-4" aria-label="Change avatar">
            <label
              htmlFor="avatar"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Change your avatar
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#1e1e1e] file:text-white hover:file:bg-[#333]"
            />
            <button
              type="button"
              disabled={!selectedFile}
              onClick={handleAvatarUpload}
              className="mt-3 bg-[#1e1e1e] text-white px-4 py-2 rounded-lg hover:bg-[#333] disabled:opacity-50"
            >
              Upload Avatar
            </button>
            {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
          </form>
        </div>
      </section>

      {user?.venueManager ? (
        <section className="mt-10">
          <ManagedVenuesSection />
        </section>
      ) : (
        <section className="mt-10 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Bookings</h2>
          <p className="text-gray-600 mb-4">
            See and manage your upcoming bookings.
          </p>
          <Link
            to="/customer"
            className="inline-block bg-[#ff4123] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#e1371c]"
          >
            View My Bookings
          </Link>
        </section>
      )}
    </main>
  );
}
