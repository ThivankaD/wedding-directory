"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sanduni & Tharindu",
    location: "Hapugala, Galle",
    text: "Our wedding day was everything we dreamed of, and it was all thanks to the amazing vendors we found through Say I Do. The process was seamless, and we were able to find everything we needed in one place. Highly recommended!",
    image: "/images/testimonial.webp",
  },
  {
    id: 2,
    name: "Sandun & Imasha",
    location: "Peradeniya, Kandy",
    text: "From the moment we started planning until the last dance at our reception, Say I Do was there for us. Their tools made budgeting and organizing stress-free, allowing us to enjoy every moment leading up to the big day.",
    image: "/images/testimonial.webp",
  },
];

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="flex justify-center py-12 sm:py-16 bg-lightYellow/40 dark:bg-darkBg transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-title text-gray-900 dark:text-zinc-100 text-center mb-8 sm:mb-10 tracking-tight">
          What other couples say about us
        </h2>
        <div className="flex items-center justify-center w-full gap-2 sm:gap-4">
          <button
            type="button"
            onClick={prevTestimonial}
            className="p-2 rounded-full hover:bg-orange/10 dark:hover:bg-zinc-800 text-gray-400 hover:text-orange dark:text-zinc-500 dark:hover:text-orange transition-colors cursor-pointer"
            aria-label="Previous testimonial"
          >
            <FaCaretLeft size={28} />
          </button>
          <div className="relative flex flex-col md:flex-row items-center justify-center w-full p-2">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8 bg-white dark:bg-darkSurface border border-orange/15 dark:border-zinc-800 rounded-3xl shadow-sm w-full">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-orange/25 dark:border-orange/30 shadow-xs shrink-0">
                <Image
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="object-cover"
                  fill
                />
              </div>
              <div className="flex flex-col text-center md:text-left flex-1 min-w-0">
                <p className="text-sm sm:text-base font-body text-gray-700 dark:text-zinc-300 italic leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                </p>
                <h3 className="text-2xl sm:text-3xl font-montez text-orange mt-3">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-xs uppercase tracking-wider font-body font-semibold text-gray-500 dark:text-zinc-400 mt-0.5">
                  {testimonials[currentTestimonial].location}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={nextTestimonial}
            className="p-2 rounded-full hover:bg-orange/10 dark:hover:bg-zinc-800 text-gray-400 hover:text-orange dark:text-zinc-500 dark:hover:text-orange transition-colors cursor-pointer"
            aria-label="Next testimonial"
          >
            <FaCaretRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
