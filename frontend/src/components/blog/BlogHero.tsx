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
          Wedding Inspiration <span className="text-orange">&</span> Community
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-zinc-300 mb-6 sm:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Read real stories, get expert planning advice, and see what couples are saying about local vendors in our vibrant community.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="#community-reviews" className="w-full sm:w-auto px-8 py-3 bg-orange text-white rounded-full font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange/30 text-center">
            Read Reviews
          </Link>
          <Link href="#expert-articles" className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-darkSurface text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-darkElevated transition-all shadow-sm text-center">
            Expert Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
