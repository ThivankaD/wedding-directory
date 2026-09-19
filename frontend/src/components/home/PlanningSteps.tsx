import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const cards = [
  {
    id: 1,
    tagLine: "sample tag line",
    title: "Your Vendors",
    description:
      "We'll help you find the perfect vendors for your wedding, tailored to your specific needs!",
    buttonText: "Get Started",
    image: "/images/venue.webp",
  },
  {
    id: 2,
    tagLine: "sample tag line",
    title: "Your Budget",
    description:
      "Set up your budget and manage your finances with our easy-to-use budgeting tool!",
    buttonText: "Get Started",
    image: "/images/cakes.webp",
  },
  {
    id: 3,
    tagLine: "sample tag line",
    title: "Your Checklist",
    description:
      "We'll walk you through every part of planning, so you can plan your big day in no time!",
    buttonText: "Get Started",
    image: "/images/florists.webp",
  },
];

const PlanningSteps = () => {
  return (
    <section className="flex justify-center py-12 sm:py-16 bg-white dark:bg-darkSurface border-y border-orange/10 dark:border-zinc-800 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-title text-gray-900 dark:text-zinc-100 mb-8 sm:mb-12 text-center tracking-tight">
          Wedding planning has never been easier
        </h2>

        <div className="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8 w-full">
          {/* Responsive image container */}
          <div className="hidden lg:block lg:w-5/12">
            <div className="relative h-full min-h-[380px] rounded-2xl overflow-hidden border border-orange/15 dark:border-zinc-800 shadow-sm">
              <Image
                src="/images/bridaldressing.webp"
                alt="Wedding Planning"
                className="object-cover w-full h-full"
                fill
              />
            </div>
          </div>

          {/* Responsive cards container */}
          <div className="w-full lg:w-7/12 flex flex-col space-y-4 sm:space-y-5">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 sm:p-6 bg-white dark:bg-darkElevated border border-orange/15 dark:border-zinc-700/80 rounded-2xl shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-orange/10 dark:border-zinc-700">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="flex flex-col text-center sm:text-left flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold font-title text-gray-900 dark:text-zinc-100">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-gray-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-3 flex justify-center sm:justify-start">
                    <Link
                      href="/visitor-signup"
                      className="px-4 py-1.5 rounded-xl border border-orange text-orange hover:bg-orange hover:text-white font-title text-sm font-semibold transition-colors"
                    >
                      {card.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signup section */}
        <div className="mt-12 sm:mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-title text-gray-900 dark:text-zinc-100 mb-4 tracking-tight">
            Join with Say I Do
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 font-body max-w-md mx-auto mb-6">
            Create your free couple account to explore vendors, manage budgets, and build your custom wedding checklist.
          </p>
          <Link
            href="/visitor-signup"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-title text-base sm:text-lg font-semibold text-white bg-orange hover:bg-orange/90 active:scale-[0.98] transition-all shadow-xs"
          >
            Sign up with us for free
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlanningSteps;
