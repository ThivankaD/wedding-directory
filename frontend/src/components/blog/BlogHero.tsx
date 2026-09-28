import React from "react";
import Link from "next/link";
import { FiArrowDown } from "react-icons/fi";

const BlogHero: React.FC = () => {
  return (
    <div className="relative bg-orange/10 dark:bg-orange/5 rounded-2xl overflow-hidden mb-6 sm:mb-8 border border-orange/15 dark:border-zinc-800 shadow-xs">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/blog-pattern.png')] bg-repeat bg-center"></div>
      </div>
      
      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8 md:py-9 max-w-3xl mx-auto text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-title font-bold text-gray-900 dark:text-zinc-100 mb-2 sm:mb-3 tracking-tight">
          Wedding Inspiration <span className="text-orange">&</span> Expert Advice
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-zinc-300 mb-4 sm:mb-5 max-w-xl mx-auto font-body leading-relaxed">
          Explore curated bridal trends, venue guides, budgeting breakdowns, and planning tips from industry professionals.
        </p>
        
        <div className="flex justify-center">
          <Link
            href="#expert-articles"
            className="px-5 py-2 sm:py-2.5 bg-orange hover:bg-orange/90 text-white rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <span>Explore Articles</span>
            <FiArrowDown className="text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
