import React, { useEffect, useState } from "react";
import VenueCard from "./VenueCard";
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

  if (loading) {
    return <p className="text-center py-8" role="status">Loading venues...</p>;
  }

  return (
    <section
      aria-labelledby="venue-grid-heading"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8" 
    >
      <h2 id="venue-grid-heading" className="sr-only">Venue Listings</h2>
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </section>
  );
};

export default VenueGrid;
