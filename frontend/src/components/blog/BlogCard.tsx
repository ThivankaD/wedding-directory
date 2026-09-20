"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogCardProps } from "../../types/blogTypes";
import { getBlogAssetUrl } from "../../api/blog/blog.api";
import { urlForImage } from "@/sanity/image";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80";

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);

  // Function to strip markdown for preview
  const stripMarkdown = (markdown: string) => {
    return markdown
      .replace(/#{1,6}\s?([^\n]+)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/```[^`]*```/g, "")
      .replace(/^\s*>\s*(.*)$/gm, "$1")
      .replace(/^\s*[-+*]\s+(.*)$/gm, "$1")
      .replace(/^\s*\d+\.\s+(.*)$/gm, "$1")
      .replace(/\n\n/g, " ")
      .trim();
  };

  const title = post.title || post.Title || "Wedding Planning Article";
  const slug = post.slug || post.Slug || "";
  const author = post.author || post.Author || "Wedding Expert";
  const publishedDate = post.publishedAt || post.createdAt || new Date().toISOString();
  const categoryTitle = post.category?.title;

  const rawContent = post.excerpt || post.content || post.Content || "";
  const contentPreview =
    post.excerpt ||
    (rawContent ? stripMarkdown(rawContent).substring(0, 120) + "..." : "Read this article for expert wedding tips and inspiration...");

  // Resolve image source
  let initialImageUrl = post.coverImageUrl;
  if (!initialImageUrl && post.coverImage) {
    try {
      initialImageUrl = urlForImage(post.coverImage)?.width(800).url() || undefined;
    } catch {
      initialImageUrl = undefined;
    }
  }
  if (!initialImageUrl && post.CoverImage?.url) {
    initialImageUrl = getBlogAssetUrl(post.CoverImage.url) || undefined;
  }
  const displayImageUrl = imageError || !initialImageUrl ? DEFAULT_FALLBACK_IMAGE : initialImageUrl;

  return (
    <article className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg bg-white dark:bg-darkSurface border border-gray-100 dark:border-zinc-800 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100 dark:bg-darkElevated">
        <Image
          src={displayImageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {categoryTitle && (
          <span className="absolute top-3 left-3 bg-white/95 dark:bg-darkElevated/95 backdrop-blur-xs text-orange text-xs font-bold px-2.5 py-1 rounded-full shadow-xs border border-orange/20">
            {categoryTitle}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-2.5 font-light flex items-center">
            <svg
              className="w-4 h-4 mr-1.5 text-orange flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {new Date(publishedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 font-title text-gray-900 dark:text-zinc-100 line-clamp-2 group-hover:text-orange transition-colors">
            <Link href={`/blog/${slug}`}>
              {title}
            </Link>
          </h2>

          <p className="text-gray-600 dark:text-zinc-300 mb-4 sm:mb-5 font-body text-xs sm:text-sm leading-relaxed line-clamp-3">
            {contentPreview}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-gray-600 dark:text-zinc-400 text-xs sm:text-sm font-medium">
            By {author}
          </span>
          <Link
            href={`/blog/${slug}`}
            className="text-orange hover:text-orange/80 transition-colors font-semibold text-xs sm:text-sm flex items-center group/btn"
          >
            Read More
            <svg
              className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
