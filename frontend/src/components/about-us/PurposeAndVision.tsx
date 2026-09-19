import React from "react";
import { FiHeart, FiTarget } from "react-icons/fi";

const PurposeAndVision: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full items-stretch">
      {/* Our Purpose Card */}
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-orange/15 dark:border-zinc-800 p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-orange/30 dark:hover:border-zinc-700">
        <div>
          <div className="w-12 h-12 rounded-xl bg-orange/10 dark:bg-orange/20 text-orange flex items-center justify-center mb-4">
            <FiHeart className="w-6 h-6" />
          </div>
          <h3 className="font-bold font-title text-xl sm:text-2xl text-gray-900 dark:text-zinc-100 mb-3 tracking-tight">
            Our Purpose
          </h3>
          <p className="text-gray-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-body">
            At Sayido.lk, our purpose is to bring people together, inspire love,
            and create memorable wedding experiences. We aim to simplify the
            wedding planning journey for couples across Sri Lanka, connecting them
            with the best vendors and venues in the country.
          </p>
        </div>
      </div>

      {/* Our Mission Card */}
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-orange/15 dark:border-zinc-800 p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-orange/30 dark:hover:border-zinc-700">
        <div>
          <div className="w-12 h-12 rounded-xl bg-orange/10 dark:bg-orange/20 text-orange flex items-center justify-center mb-4">
            <FiTarget className="w-6 h-6" />
          </div>
          <h3 className="font-bold font-title text-xl sm:text-2xl text-gray-900 dark:text-zinc-100 mb-3 tracking-tight">
            Our Mission
          </h3>
          <p className="text-gray-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-body">
            Our mission is to make wedding planning a stress-free and enjoyable
            experience for every couple. By leveraging innovative tools, expert
            guidance, and a curated network of professionals, we help couples plan
            the wedding of their dreams with ease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurposeAndVision;
