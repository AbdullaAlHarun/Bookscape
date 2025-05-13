import React, { useEffect, useState } from "react";
import VenueCard from "./VenueCard";
import VenueCardSkeleton from "./VenueCardSkeleton";
import { getAllVenues } from "../../services/venueService";

const VenueGrid = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const data = await getAllVenues();
        setVenues(data);
      } catch (error) {
        console.error("Failed to load venues", error);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []);

  return (
    <section
      aria-labelledby="venue-grid-heading"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
    >
      <h2 id="venue-grid-heading" className="sr-only">Venue Listings</h2>

      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <VenueCardSkeleton key={index} />
          ))
        : venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
    </section>
  );
};

export default VenueGrid;
