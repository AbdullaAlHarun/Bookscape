import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createVenue } from "../../services/venueService";

const CreateVenueForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 100,
    maxGuests: 2,
    mediaUrl: "",
    mediaAlt: "",
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
    },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (["wifi", "parking", "breakfast", "pets"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [name]: checked,
        },
      }));
    } else if (
      ["address", "city", "zip", "country", "continent"].includes(name)
    ) {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      media: form.mediaUrl
        ? [{ url: form.mediaUrl, alt: form.mediaAlt || "Venue image" }]
        : [],
      meta: form.meta,
      location: form.location,
    };

    try {
      await createVenue(payload, user.accessToken);
      navigate("/manager");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Create a New Venue</h1>

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Create venue form">
        {/* Venue Name */}
        <div>
          <label htmlFor="name" className="block font-medium">Venue Name*</label>
          <input
            id="name"
            name="name"
            required
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium">Description*</label>
          <textarea
            id="description"
            name="description"
            required
            rows="4"
            className="w-full p-2 border rounded"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Price & Guests */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block font-medium">Price / night ($)*</label>
            <input
              id="price"
              name="price"
              type="number"
              required
              className="w-full p-2 border rounded"
              value={form.price}
              onChange={handleChange}
              min={1}
            />
          </div>

          <div>
            <label htmlFor="maxGuests" className="block font-medium">Max Guests*</label>
            <input
              id="maxGuests"
              name="maxGuests"
              type="number"
              required
              className="w-full p-2 border rounded"
              value={form.maxGuests}
              onChange={handleChange}
              min={1}
            />
          </div>
        </div>

        {/* Media */}
        <div>
          <label htmlFor="mediaUrl" className="block font-medium">Image URL</label>
          <input
            id="mediaUrl"
            name="mediaUrl"
            className="w-full p-2 border rounded"
            value={form.mediaUrl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="mediaAlt" className="block font-medium">Image Alt Text</label>
          <input
            id="mediaAlt"
            name="mediaAlt"
            className="w-full p-2 border rounded"
            value={form.mediaAlt}
            onChange={handleChange}
          />
        </div>

        {/* Amenities */}
        <fieldset>
          <legend className="font-medium mb-1">Amenities</legend>
          <div className="flex gap-4 flex-wrap">
            {["wifi", "parking", "breakfast", "pets"].map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={form.meta[key]}
                  onChange={handleChange}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Location */}
        <fieldset>
          <legend className="font-medium mb-1">Location (optional)</legend>
          <div className="grid grid-cols-2 gap-4">
            {["address", "city", "zip", "country", "continent"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="p-2 border rounded"
                value={form.location[field]}
                onChange={handleChange}
              />
            ))}
          </div>
        </fieldset>

        {/* Error */}
        {error && <p className="text-red-600" role="alert">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Venue"}
        </button>
      </form>
    </main>
  );
};

export default CreateVenueForm;
