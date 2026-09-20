import React from "react";
import VendorHeader from "@/components/shared/Headers/VendorHeader";
import VisitorHeader from "@/components/shared/Headers/VisitorHeader";
import Footer from "@/components/shared/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferingCardSkeleton } from "./OfferingCardSkeleton";

export const VendorDashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightYellow dark:bg-darkBg flex flex-col font-body transition-colors duration-200">
      <VendorHeader />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-60 rounded-xl" />
            <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Asymmetric Profile + Booking Calendar Layout (4 cols + 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8 items-start">
          {/* Left Column (4 cols): Vendor Profile Hub Card */}
          <div className="lg:col-span-4">
            <div className="w-full bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-7 flex flex-col items-center text-center">
              {/* Profile Image Circle */}
              <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-3" />

              {/* Greeting & Business Name */}
              <Skeleton className="h-3.5 w-32 rounded mb-2" />
              <Skeleton className="h-7 w-48 rounded-lg mb-5" />

              {/* Contact Details Card */}
              <div className="w-full bg-gray-50/70 dark:bg-darkElevated border border-gray-100 dark:border-zinc-700/80 rounded-xl p-3.5 mb-6 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-3.5 w-32 rounded" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-3.5 w-40 rounded" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-3.5 w-48 rounded" />
                </div>
              </div>

              {/* 4 Quick Links List */}
              <div className="w-full flex flex-col gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-darkElevated/50"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <div className="space-y-1.5 text-left">
                        <Skeleton className="h-3.5 w-32 rounded" />
                        <Skeleton className="h-2.5 w-24 rounded" />
                      </div>
                    </div>
                    <Skeleton className="w-4 h-4 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Tabs & Calendar Card */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Tab Switcher Pills */}
            <div className="flex items-center gap-2 bg-white dark:bg-darkSurface p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 w-fit self-start">
              <Skeleton className="h-8 w-32 rounded-xl" />
              <Skeleton className="h-8 w-36 rounded-xl" />
            </div>

            {/* Booking Calendar Card */}
            <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-7 flex flex-col h-full space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-44 rounded-lg" />
                  <Skeleton className="h-3.5 w-64 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-28 rounded-xl" />
                  <div className="flex gap-1">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-3">
                {/* 7 Day of week headers */}
                <div className="grid grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-5 w-full rounded" />
                  ))}
                </div>
                {/* 35 Calendar day cells */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 sm:h-20 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section Card */}
        <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-7 mb-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-7 w-20 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-48 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <OfferingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const VisitorDashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightYellow dark:bg-darkBg flex flex-col font-body transition-colors duration-200">
      <VisitorHeader />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-60 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Asymmetric Profile Hub + Planning Widgets Layout (4 cols + 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-10 items-stretch">
          {/* Left Column (4 cols): Couple Profile Card matching VisitorCoupleBanner */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="w-full bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-7 flex flex-col items-center text-center h-full">
              {/* Couple Avatar */}
              <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-3" />

              {/* Couple Names */}
              <Skeleton className="h-6 w-44 rounded-lg mb-2" />

              {/* Countdown Pill */}
              <Skeleton className="h-7 w-48 rounded-full mb-6" />

              {/* 6 Navigation Items */}
              <div className="w-full flex flex-col gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-darkElevated/50"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <div className="space-y-1.5 text-left">
                        <Skeleton className="h-3.5 w-28 rounded" />
                        <Skeleton className="h-2.5 w-20 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): 2x3 Widget Grid matching DashboardWidgets */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full flex-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-darkSurface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between space-y-4 min-h-[160px]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="w-9 h-9 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-3 w-full rounded-full" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3.5 w-24 rounded" />
                      <Skeleton className="h-3.5 w-16 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
