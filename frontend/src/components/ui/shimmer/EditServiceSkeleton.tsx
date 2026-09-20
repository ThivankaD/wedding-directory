import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PackagesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header section skeleton */}
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-7 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-72 rounded" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Package cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <Skeleton className="w-full h-44 rounded-none" />
              <div className="p-5 sm:p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
                <div className="flex items-baseline gap-2 pt-2">
                  <Skeleton className="h-8 w-36 rounded-lg" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-32 rounded-lg" />
                </div>
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-3 bg-gray-50/50 dark:bg-darkElevated/30 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GeneralFormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-7 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-72 rounded" />
          </div>
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-zinc-800">
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MediaSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="w-full h-56 rounded-2xl" />
        </div>
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Skeleton className="h-4 w-36 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SocialLinksSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Skeleton className="h-11 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
