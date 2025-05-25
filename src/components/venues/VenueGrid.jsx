import React, { useEffect, useState } from "react";
import VenueCard from "./VenueCard";
import VenueCardSkeleton from "./VenueCardSkeleton";
import { getVenuesPage } from "../../services/venueService";

const INITIAL_PAGE = 1;
const PAGE_LIMIT = 12;

const VenueGrid = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [totalCount, setTotalCount] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadVenues(INITIAL_PAGE);
  }, []);

  const loadVenues = async (pageToLoad) => {
    try {
      const { venues: data, totalCount } = await getVenuesPage(pageToLoad, PAGE_LIMIT);
      setVenues((prev) => [...prev, ...data]);
      setTotalCount(totalCount);
      setPage(pageToLoad);
    } catch (error) {
      console.error("Failed to load venues", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    loadVenues(page + 1);
    setTimeout(() => {
      document.getElementById("venue-grid")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const allLoaded = totalCount !== null && venues.length >= totalCount;

  return (
    <>
      <section
        id="venue-grid"
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8"
        role="status"
        aria-busy={loading}
        aria-live="polite"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <VenueCardSkeleton key={i} />)
          : venues.map((venue, index) => (
              <VenueCard key={`${venue.id}-${index}`} venue={venue} />
            ))}
      </section>

      {!loading && !allLoaded && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow hover:bg-orange-600 transition"
            aria-label="Load more venues"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
};

export default VenueGrid;
