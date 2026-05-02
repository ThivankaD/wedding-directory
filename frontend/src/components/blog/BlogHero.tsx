import React from "react";
import Link from "next/link";

const BlogHero: React.FC = () => {
  return (
    <div className="relative bg-orange/10 rounded-3xl overflow-hidden mb-16 shadow-inner">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/images/blog-pattern.png')] bg-repeat bg-center"></div>
      </div>
      
      <div className="relative z-10 px-6 py-16 md:py-24 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-gray-900 mb-6 tracking-tight">
          Wedding Inspiration <span className="text-orange">&</span> Community
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto font-light">
          Read real stories, get expert planning advice, and see what couples are saying about local vendors in our vibrant community.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#community-reviews" className="px-8 py-3 bg-orange text-white rounded-full font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange/30">
            Read Reviews
          </Link>
          <Link href="#expert-articles" className="px-8 py-3 bg-white text-gray-800 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm">
            Expert Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
