import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getVenueById, updateVenue } from "../../services/venueService";

export default function EditVenueForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const venue = await getVenueById(id);
        setForm({
          name: venue.name || "",
          description: venue.description || "",
          price: venue.price || "",
          maxGuests: venue.maxGuests || "",
          mediaUrl: venue.media?.[0]?.url || "",
          mediaAlt: venue.media?.[0]?.alt || "",
          meta: {
            wifi: venue.meta?.wifi || false,
            parking: venue.meta?.parking || false,
            breakfast: venue.meta?.breakfast || false,
            pets: venue.meta?.pets || false,
          },
          location: {
            address: venue.location?.address || "",
            city: venue.location?.city || "",
            zip: venue.location?.zip || "",
            country: venue.location?.country || "",
            continent: venue.location?.continent || "",
          },
        });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };
    loadVenue();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

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
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      media: form.mediaUrl
        ? [{ url: form.mediaUrl, alt: form.mediaAlt || form.name }]
        : [],
      meta: form.meta,
      location: form.location,
    };

    try {
      await updateVenue(id, payload, user.accessToken);
      navigate("/manager");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Venue</h1>

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Edit venue form">
        {/* Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          placeholder="Venue Name"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Description"
        />

        {/* Price and Max Guests */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Price / night"
            min={1}
            required
          />
          <input
            type="number"
            name="maxGuests"
            value={form.maxGuests}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Max Guests"
            min={1}
            required
          />
        </div>

        {/* Media */}
        <input
          name="mediaUrl"
          value={form.mediaUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Image URL"
        />
        <input
          name="mediaAlt"
          value={form.mediaAlt}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Image Alt"
        />

        {/* Meta */}
        <fieldset>
          <legend className="font-medium mb-2">Amenities</legend>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(form.meta).map(([key, val]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={val}
                  onChange={handleChange}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Location */}
        <fieldset>
          <legend className="font-medium mb-2">Location (optional)</legend>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(form.location).map(([key, val]) => (
              <input
                key={key}
                name={key}
                value={val || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder={key}
              />
            ))}
          </div>
        </fieldset>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Venue"}
        </button>
      </form>
    </main>
  );
}
