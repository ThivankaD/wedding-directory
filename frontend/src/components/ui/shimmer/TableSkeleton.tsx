import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-4 w-60 rounded" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="p-4 sm:p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 flex-1">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              {Array.from({ length: Math.max(1, cols - 2) }).map((_, c) => (
                <Skeleton key={c} className="h-4 w-20 rounded" />
              ))}
            </div>
            <Skeleton className="h-8 w-16 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
