import React from "react";

const VenueCardSkeleton = () => {
  return (
    <div className="bg-white animate-pulse rounded-2xl shadow p-4 space-y-4">
      <div className="w-full h-48 bg-gray-200 rounded-md" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-3 w-1/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-2/5 bg-gray-200 rounded" />
    </div>
  );
};

export default VenueCardSkeleton;
