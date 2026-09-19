import React from "react";

const AboutUsSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-orange/15 dark:border-zinc-800 p-6 sm:p-8 md:p-10 transition-colors">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange/10 text-orange border border-orange/20 mb-3">
        About Us
      </div>
      <h2 className="font-title font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 dark:text-zinc-100 mb-4 tracking-tight">
        Your Wedding Journey Starts Here
      </h2>
      <p className="text-gray-600 dark:text-zinc-300 font-body text-base sm:text-lg leading-relaxed">
        At Sayido.lk, we celebrate the beauty of weddings by connecting Sri
        Lankan couples with the best local vendors, venues, and services. Our
        platform is designed to make wedding planning easier and more
        personalized, helping you bring your dream celebration to life. From
        photographers and florists to breathtaking venues, Sayido.lk is your
        go-to destination for finding trusted professionals who understand the
        unique charm and traditions of Sri Lankan weddings. Whether you&apos;re
        planning an intimate gathering or a grand celebration, we&apos;re here to
        guide you every step of the way, turning inspiration into action with
        ease.
      </p>
    </div>
  );
};

export default AboutUsSection;
