"use client";

import React from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import BlogCommunityReviews from "@/components/blog/BlogCommunityReviews";

export default function BlogPage() {
  return (
    <div className="bg-lightYellow font-body min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <BlogCommunityReviews />
      </div>

      <Footer />
    </div>
  );
}
