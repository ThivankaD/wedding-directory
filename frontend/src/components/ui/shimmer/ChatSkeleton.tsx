"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Search Bar Skeleton */}
      <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* List Items */}
      <div className="p-3 space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-darkSurface"
          >
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-14" />
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col h-[580px] rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-darkSurface overflow-hidden shadow-xs animate-fade-in">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        {/* Incoming message */}
        <div className="flex items-start gap-2.5 max-w-[70%]">
          <Skeleton className="w-7 h-7 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-14 w-60 rounded-2xl rounded-tl-sm" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[70%]">
          <Skeleton className="h-10 w-48 rounded-2xl rounded-tr-sm bg-orange/20 dark:bg-orange/15" />
          <Skeleton className="h-2.5 w-16" />
        </div>

        {/* Incoming message */}
        <div className="flex items-start gap-2.5 max-w-[70%]">
          <Skeleton className="w-7 h-7 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-20 w-72 rounded-2xl rounded-tl-sm" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[70%]">
          <Skeleton className="h-16 w-56 rounded-2xl rounded-tr-sm bg-orange/20 dark:bg-orange/15" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-3">
        <Skeleton className="h-11 flex-1 rounded-2xl" />
        <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
      </div>
    </div>
  );
}
