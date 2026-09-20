"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/image";
import { FiExternalLink, FiStar } from "react-icons/fi";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-bold font-title text-gray-900 dark:text-zinc-100 mt-10 mb-4 tracking-tight scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold font-title text-gray-900 dark:text-zinc-100 mt-8 mb-3 scroll-mt-24">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg sm:text-xl font-semibold font-title text-gray-800 dark:text-zinc-200 mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-zinc-300 mb-6 font-body">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-orange pl-5 py-2 my-6 bg-orange/5 dark:bg-orange/10 rounded-r-2xl italic text-gray-800 dark:text-zinc-200 text-base sm:text-lg font-body">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-gray-700 dark:text-zinc-300 font-body text-base sm:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 mb-6 text-gray-700 dark:text-zinc-300 font-body text-base sm:text-lg">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-zinc-100">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-darkElevated px-1.5 py-0.5 rounded text-sm font-mono text-orange">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <Link
          href={value?.href || "#"}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-orange font-semibold hover:underline decoration-orange/40 hover:decoration-orange"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const imageUrl = urlForImage(value)?.width(1200).url();
      if (!imageUrl) return null;

      return (
        <figure className="my-8 overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageUrl}
              alt={value.alt || "Say I Do Blog Image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs sm:text-sm text-gray-500 dark:text-zinc-400 p-2.5 bg-gray-50 dark:bg-darkElevated">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    vendorCallout: ({ value }) => {
      return (
        <div className="my-8 p-5 sm:p-6 bg-gradient-to-r from-orange/10 via-orange/5 to-transparent dark:from-darkElevated dark:via-darkElevated/70 dark:to-darkSurface rounded-2xl border-2 border-orange/20 dark:border-orange/30 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-orange">
                  ★ Featured Vendor Recommendation
                </span>
                {value.rating && (
                  <div className="flex items-center text-amber-400 text-xs">
                    <FiStar className="fill-amber-400" />
                    <span className="ml-1 text-gray-700 dark:text-zinc-300 font-semibold">
                      {value.rating}.0
                    </span>
                  </div>
                )}
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-title text-gray-900 dark:text-zinc-100">
                {value.vendorName}
              </h4>
              {value.category && (
                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">
                  {value.category}
                </p>
              )}
              {value.description && (
                <p className="text-sm text-gray-700 dark:text-zinc-300 font-body leading-relaxed">
                  {value.description}
                </p>
              )}
            </div>
            {value.linkUrl && (
              <Link
                href={value.linkUrl}
                className="self-start sm:self-center px-4 py-2 bg-orange hover:bg-orange/90 text-white font-title text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span>View Profile</span>
                <FiExternalLink size={14} />
              </Link>
            )}
          </div>
        </div>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: any;
}

export default function PortableTextRenderer({
  value,
}: PortableTextRendererProps) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
