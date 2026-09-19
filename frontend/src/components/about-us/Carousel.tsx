"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-[260px] sm:h-[380px] md:h-[440px] lg:h-[480px] rounded-2xl overflow-hidden shadow-lg border border-black/5 dark:border-zinc-800 bg-gray-100 dark:bg-darkSurface group">
      {/* Display the current image */}
      <Image
        src={images[currentIndex]}
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        priority={currentIndex === 0}
        alt={`Say I Do Wedding Showcase ${currentIndex + 1}`}
        className="object-cover transition-all duration-500 rounded-2xl"
      />

      {/* Subtle top and bottom gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none rounded-2xl" />

      {/* Left Arrow */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous image"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-95 cursor-pointer shadow-md border border-white/20 hover:border-white/40 z-10"
      >
        <MdArrowBackIos className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
      </button>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next image"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-95 cursor-pointer shadow-md border border-white/20 hover:border-white/40 z-10"
      >
        <MdArrowForwardIos className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Slide Dots / Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx
                ? "w-6 sm:w-7 bg-orange shadow-xs"
                : "w-2 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
