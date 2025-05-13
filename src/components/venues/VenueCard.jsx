import React from "react";

const VenueCard = ({ venue }) => {
  const { name, media, price, location } = venue;

  const imageUrl = media?.[0]?.url || "/placeholder.jpg";
  const imageAlt = media?.[0]?.alt || `${name} venue image`;

  return (
    <article className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-4 flex flex-col h-full" role="region" aria-label={`Venue: ${name}`}>
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-48 object-cover rounded-md mb-3"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {location?.city || "Unknown location"}
        </p>
        <p className="text-sm text-gray-800 font-medium mt-2">
          From ${price} / night
        </p>
      </div>
    </article>
  );
};

export default VenueCard;
