import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVenueById } from "../../services/venueService";
import {
  FaWifi,
  FaParking,
  FaPaw,
  FaCoffee,
  FaStar,
} from "react-icons/fa";
import placeholderImage from "../../assets/placeholder.png";

export default function VenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const data = await getVenueById(id);
        setVenue(data);

        // Set dynamic title + meta
        document.title = `${data.name} | BookScape`;

        const desc = data.description?.slice(0, 150) || "Venue details on BookScape.";
        let meta = document.head.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "description";
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", desc);
      } catch (error) {
        console.error("Failed to fetch venue details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return <p className="text-center py-8" role="status">Loading venue details...</p>;
  }

  if (!venue) {
    return <p className="text-center py-8 text-red-500" role="alert">Venue not found.</p>;
  }

  const {
    name,
    description,
    media,
    price,
    rating,
    maxGuests,
    meta,
    location,
  } = venue;

  const imageUrl = media?.[0]?.url || placeholderImage;
  const imageAlt = media?.[0]?.alt || `${name} venue image`;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section aria-labelledby="venue-title" className="space-y-6">
        <h1
          id="venue-title"
          className="text-2xl sm:text-3xl font-bold text-gray-900 break-words"
        >
          {name}
        </h1>

        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-4">
            <p className="text-gray-700 text-base leading-relaxed">{description}</p>

            <ul className="text-sm text-gray-600 space-y-1">
              {location?.address && (
                <li>
                  <strong>📍 Address:</strong> {location.address}, {location.city}, {location.country}
                </li>
              )}
              {location?.continent && (
                <li><strong>🌍 Continent:</strong> {location.continent}</li>
              )}
              {location?.zip && (
                <li><strong>📫 Zip:</strong> {location.zip}</li>
              )}
            </ul>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mt-4">
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400" /> {rating ?? 0}
              </span>
              <span className="flex items-center gap-1">
                👥 {maxGuests} guests
              </span>
              <span className="text-lg font-semibold text-orange-600">
                ${price} <span className="text-sm font-normal">/ night</span>
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-4 text-gray-700 text-base">
                {meta?.wifi && <span className="flex items-center gap-2"><FaWifi /> WiFi</span>}
                {meta?.parking && <span className="flex items-center gap-2"><FaParking /> Parking</span>}
                {meta?.pets && <span className="flex items-center gap-2"><FaPaw /> Pets Allowed</span>}
                {meta?.breakfast && <span className="flex items-center gap-2"><FaCoffee /> Breakfast</span>}
                {!meta?.wifi && !meta?.parking && !meta?.pets && !meta?.breakfast && (
                  <span>No amenities listed.</span>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(`/venues/${id}/book`)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-md transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
