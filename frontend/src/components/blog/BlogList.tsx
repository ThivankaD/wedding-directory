"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import { getBlogPosts, getBlogCategories, SanityCategory } from "@/sanity/client";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blogTypes";

const POSTS_PER_PAGE = 6;

const BlogList: React.FC = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getBlogCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Load posts whenever selectedCategory changes
  useEffect(() => {
    let isMounted = true;
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await getBlogPosts(selectedCategory);
        if (isMounted) {
          setAllPosts(data as unknown as BlogPost[]);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPosts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const displayedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("expert-articles");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  return (
    <section id="expert-articles" className="mb-20 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
            Expert Articles
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 mt-2 text-sm sm:text-base font-body">
            Tips, inspiration, and advice curated by wedding industry professionals.
          </p>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat._id || cat.slug}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-title font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-orange text-white shadow-xs shadow-orange/30 scale-105"
                      : "bg-white dark:bg-darkSurface text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 hover:border-orange/50 hover:text-orange"
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-darkSurface rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 p-4"
            >
              <Skeleton className="w-full h-48 rounded-xl bg-gray-200 dark:bg-darkElevated" />
              <Skeleton className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-darkElevated" />
              <Skeleton className="h-4 w-full rounded bg-gray-200 dark:bg-darkElevated" />
              <Skeleton className="h-4 w-2/3 rounded bg-gray-200 dark:bg-darkElevated" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24 rounded bg-gray-200 dark:bg-darkElevated" />
                <Skeleton className="h-4 w-20 rounded bg-gray-200 dark:bg-darkElevated" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <BlogCard key={post._id || post.id || post.documentId || post.slug} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-darkSurface rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-zinc-800 my-8">
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-xl font-bold font-title text-gray-900 dark:text-zinc-100 mb-2">
            No articles found in this category
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 mb-6 font-body text-sm">
            Check back soon or select another category above for wedding inspiration and tips.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="px-4 py-2 bg-orange text-white rounded-xl text-sm font-semibold hover:bg-orange/90 transition-colors cursor-pointer"
          >
            Show All Articles
          </button>
        </div>
      )}
    </section>
  );
};

export default BlogList;
