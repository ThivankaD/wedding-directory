"use client";

import React from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import BlogCommunityReviews from "@/components/blog/BlogCommunityReviews";
import BlogHero from "@/components/blog/BlogHero";
import BlogList from "@/components/blog/BlogList";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-lightYellow dark:bg-darkBg text-gray-900 dark:text-zinc-100 font-body transition-colors duration-200">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12 w-full">
        <BlogHero />
        <BlogList />
        
        <div id="community-reviews" className="pt-8">
          <BlogCommunityReviews />
        </div>
      </main>

      <Footer />
    </div>
  );
}
