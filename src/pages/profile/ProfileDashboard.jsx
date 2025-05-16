import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUserAvatar } from "../../services/profileService";
import { uploadImageToImgBB } from "../../services/profileUploader";
import ManagedVenuesSection from "../../components/profile/ManagedVenuesSection";

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

      // ✅ Upload to ImgBB and get public image URL
      const imageUrl = await uploadImageToImgBB(selectedFile);

      // ✅ Update avatar on Holidaze API
      const updated = await updateUserAvatar(user.name, imageUrl);

      // ✅ Update context with new avatar
      updateAvatar(updated);

      setStatus("✅ Avatar updated!");
    } catch (error) {
      setStatus("❌ Failed: " + error.message);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <section
        className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center gap-6"
        aria-labelledby="profile-info-heading"
      >
        <img
          src={user?.avatar?.url || `https://i.pravatar.cc/150?u=${user?.email}`}
          alt={user?.avatar?.alt || `${user?.name}'s avatar`}
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div className="text-center md:text-left">
          <h1
            id="profile-info-heading"
            className="text-2xl font-bold text-gray-900"
          >
            {user?.name}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            Role: {user?.venueManager ? "Venue Manager 🏨" : "Customer 🎓"}
          </p>

          {/* Avatar Upload UI */}
          <form className="mt-4" aria-label="Change avatar">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change your avatar
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white hover:file:bg-gray-800"
            />
            <button
              type="button"
              disabled={!selectedFile}
              onClick={handleAvatarUpload}
              className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              Upload Avatar
            </button>
            {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
          </form>
        </div>
      </section>

      {/* Manager vs Customer Section */}
      {user?.venueManager ? (
        <section className="mt-10">
         
          <ManagedVenuesSection />
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
          <p className="text-gray-600">See and manage your upcoming bookings</p>
          {/* TODO: Booking list here */}
        </section>
      )}
    </main>
  );
}
