import React from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export const ServiceDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-lightYellow dark:bg-darkBg text-gray-900 dark:text-zinc-100 font-body transition-colors duration-200">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Back Link skeleton */}
        <div className="mb-4">
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>

        {/* Hero Banner Skeleton */}
        <div className="relative w-full h-72 sm:h-96 mb-8 rounded-3xl overflow-hidden shadow-sm">
          <Skeleton className="w-full h-full rounded-3xl" />
        </div>

        {/* Vendor Header Card Skeleton */}
        <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar circle */}
              <Skeleton className="w-20 h-20 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-56 rounded-lg" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-11 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Two Column Layout: Main Content + Right Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Details Section Card */}
            <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-11/12 rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <Skeleton className="h-6 w-28 rounded-lg mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
            </div>

            {/* Packages Section Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-36 rounded-lg" />
                <Skeleton className="h-9 w-32 rounded-xl" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-darkSurface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <Skeleton className="w-full h-40 rounded-xl" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/2 rounded-lg" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-8 w-1/3 rounded-lg" />
                      <Skeleton className="h-4 w-4/5 rounded" />
                      <div className="space-y-2 pt-2">
                        <Skeleton className="h-3.5 w-full rounded" />
                        <Skeleton className="h-3.5 w-5/6 rounded" />
                        <Skeleton className="h-3.5 w-3/4 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl mt-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Widget Column (1 col) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-11 w-full rounded-xl mt-2" />
            </div>

            <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-3">
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="w-full h-44 rounded-xl" />
              <Skeleton className="h-3.5 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailSkeleton;
