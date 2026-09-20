import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const OfferingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col h-full">
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Banner image skeleton */}
        <Skeleton className="w-full h-48 mb-3 rounded-xl" />

        <div className="flex flex-col mb-3 flex-1 space-y-2">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 rounded-lg" />

          {/* Rating stars skeleton */}
          <div className="flex items-center gap-1.5 py-0.5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3.5 w-8 rounded" />
          </div>

          {/* Vendor name skeleton */}
          <Skeleton className="h-4 w-1/2 rounded" />

          {/* City skeleton */}
          <Skeleton className="h-3.5 w-1/3 rounded" />
        </div>

        {/* Action button skeleton */}
        <Skeleton className="mt-auto h-10 w-full rounded-xl" />
      </div>
    </div>
  );
};

interface OfferingGridSkeletonProps {
  count?: number;
}

export const OfferingGridSkeleton: React.FC<OfferingGridSkeletonProps> = ({
  count = 8,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <OfferingCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default OfferingCardSkeleton;
