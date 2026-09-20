"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import { fetchBlogPosts } from "@/api/blog/blog.api";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blogTypes";

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPosts = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchBlogPosts(page, 6);
      if (response && response.data) {
        setPosts(response.data);
        setTotalPages(response.meta?.pagination?.pageCount || 1);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of the blog section
    const element = document.getElementById("expert-articles");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-darkSurface rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 p-4"
          >
            <Skeleton className="w-full h-48 rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section id="expert-articles" className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-title font-bold text-gray-800">Expert Articles</h2>
          <p className="text-gray-600 mt-2">Tips, inspiration, and advice for your big day.</p>
        </div>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id || post.documentId} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles yet</h3>
          <p className="text-gray-500">Check back soon for amazing wedding inspiration and tips.</p>
        </div>
      )}
    </section>
  );
};

export default BlogList;
