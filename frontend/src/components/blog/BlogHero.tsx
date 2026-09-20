import React from "react";
import Link from "next/link";

const BlogHero: React.FC = () => {
  return (
    <div className="relative bg-orange/10 dark:bg-orange/5 rounded-3xl overflow-hidden mb-8 sm:mb-12 md:mb-16 border border-orange/15 dark:border-zinc-800 shadow-inner">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/images/blog-pattern.png')] bg-repeat bg-center"></div>
      </div>
      
      <div className="relative z-10 px-4 sm:px-6 py-10 sm:py-16 md:py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-bold text-gray-900 dark:text-zinc-100 mb-3 sm:mb-6 tracking-tight">
          Wedding Inspiration <span className="text-orange">&</span> Expert Advice
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-zinc-300 mb-6 sm:mb-8 max-w-2xl mx-auto font-light leading-relaxed">
          Explore curated bridal trends, venue guides, budgeting breakdowns, and planning tips from industry professionals.
        </p>
        
        <div className="flex justify-center">
          <Link
            href="#expert-articles"
            className="px-8 py-3.5 bg-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-orange/30 text-center text-sm sm:text-base inline-flex items-center gap-2"
          >
            <span>Explore Articles</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
