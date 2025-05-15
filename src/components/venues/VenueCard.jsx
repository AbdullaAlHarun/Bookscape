import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaWifi,
  FaParking,
  FaPaw,
  FaCoffee,
  FaStar,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import placeholderImage from "../../assets/placeholder.png";

const VenueCard = ({ venue, onDelete }) => {
  const navigate = useNavigate();
  const { user, isVenueManager } = useAuth();

  const {
    id,
    name,
    media,
    price,
    location,
    rating,
    maxGuests,
    meta,
    created,
    owner,
  } = venue;

  const hasImage = media?.length > 0 && media[0]?.url;
  const imageUrl = hasImage ? media[0].url : placeholderImage;
  const imageAlt = hasImage
    ? media[0]?.alt || `${name} venue`
    : `Placeholder image for ${name}`;

  const isNew = new Date() - new Date(created) < 1000 * 60 * 60 * 24 * 30;
  const isOwner = user?.name === owner?.name;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-200 overflow-hidden flex flex-col relative">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-48 object-cover"
        loading="lazy"
      />

      {isNew && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          NEW
        </span>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between gap-2">
        {/* Title links to venue detail */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 hover:underline">
          <Link to={`/venues/${id}`}>{name}</Link>
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1">
          {location?.city}, {location?.country}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-700 mt-2">
          <span>👥 {maxGuests} guests</span>
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" /> {rating ?? 0}
          </span>
        </div>

        <div className="flex gap-3 mt-3 text-gray-600 text-base">
          {meta?.wifi && <FaWifi title="WiFi" />}
          {meta?.parking && <FaParking title="Parking" />}
          {meta?.pets && <FaPaw title="Pets allowed" />}
          {meta?.breakfast && <FaCoffee title="Breakfast included" />}
        </div>

        <div className="text-right mt-4">
          <p className="text-base font-bold text-gray-900">
            From ${price} <span className="text-sm font-normal">/ night</span>
          </p>
        </div>

        {/* Action buttons if owner */}
        {isVenueManager && isOwner && (
          <div className="mt-4 flex justify-between gap-2">
            <button
              onClick={() => navigate(`/manager/edit/${id}`)}
              className="text-sm text-blue-600 hover:underline"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete?.(id)}
              className="text-sm text-red-600 hover:underline"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueCard;
