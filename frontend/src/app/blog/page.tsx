"use client";

import React from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import BlogCommunityReviews from "@/components/blog/BlogCommunityReviews";
import BlogHero from "@/components/blog/BlogHero";
import BlogList from "@/components/blog/BlogList";

export default function BlogPage() {
  return (
    <div className="bg-lightYellow font-body min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <BlogHero />
        <BlogList />
        
        <div id="community-reviews" className="pt-8">
          <BlogCommunityReviews />
        </div>
      </div>

      <Footer />
    </div>
  );
}
