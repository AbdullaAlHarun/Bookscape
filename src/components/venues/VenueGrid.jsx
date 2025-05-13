import React, { useEffect, useState } from "react";
import VenueCard from "./VenueCard";
import VenueCardSkeleton from "./VenueCardSkeleton";
import { getAllVenues } from "../../services/venueService";

const INITIAL_PAGE = 1;
const INITIAL_LIMIT = 16;
const LOAD_MORE_LIMIT = 8;

const VenueGrid = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [totalCount, setTotalCount] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadInitialVenues = async () => {
      try {
        const { venues: data, totalCount } = await getAllVenues(
          INITIAL_PAGE,
          INITIAL_LIMIT
        );
        setVenues(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to load venues", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialVenues();
  }, []);

  const loadMoreVenues = async () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const { venues: newVenues } = await getAllVenues(nextPage, LOAD_MORE_LIMIT);
      setVenues((prev) => [...prev, ...newVenues]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more venues", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const allLoaded = totalCount !== null && venues.length >= totalCount;

  return (
    <>
      <section
        aria-labelledby="venue-grid-heading"
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
      >
        <h2 id="venue-grid-heading" className="sr-only">
          Venue Listings
        </h2>

        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <VenueCardSkeleton key={index} />
            ))
          : venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
      </section>

      {/* Load More Button */}
      {!loading && !allLoaded && (
        <div className="flex justify-center mt-8">
         <button
            onClick={loadMoreVenues}
            disabled={isLoadingMore}
            className="bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 rounded-xl shadow transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            >
            {isLoadingMore ? "Loading..." : "Load More"}
        </button>

        </div>
      )}

      {/* All Loaded Message */}
      {allLoaded && (
        <p className="text-center text-gray-500 mt-8">
          🎉 All venues loaded
        </p>
      )}
    </>
  );
};

export default VenueGrid;
