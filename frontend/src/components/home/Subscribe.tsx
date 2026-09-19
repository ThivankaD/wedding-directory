import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Subscribe = () => {
  return (
    <div className="h-auto py-12 md:py-16 w-full bg-brown dark:bg-[#1A1615] border-y border-orange/15 dark:border-zinc-800/80 flex justify-center items-center transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-screen-lg px-4 sm:px-6 gap-6 md:gap-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-title text-white text-center md:text-left leading-tight">
          Get started with &apos;Say I Do&apos;
          <br className="hidden sm:block" />
          <span className="text-white/90"> and plan your dream wedding</span>
        </h2>
        <Link
          href="/visitor-signup"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white hover:bg-orange hover:text-white text-gray-900 dark:bg-orange dark:text-white dark:hover:bg-orange/90 font-title text-base sm:text-lg font-semibold shadow-md transition-all shrink-0"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  );
};

export default Subscribe;
