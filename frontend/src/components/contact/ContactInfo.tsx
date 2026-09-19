import React from "react";
import { FiMail, FiClock } from "react-icons/fi";

const ContactInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
      {/* Email Section */}
      <div className="bg-white dark:bg-darkSurface rounded-3xl border border-orange/20 dark:border-zinc-800 shadow-sm p-6 sm:p-8 text-center hover:shadow-md hover:border-orange/30 dark:hover:border-zinc-700 transition-all flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-orange/10 dark:bg-orange/20 text-orange flex items-center justify-center mb-4 border border-orange/15 shadow-xs">
          <FiMail className="text-2xl" />
        </div>
        <h3 className="font-title font-bold text-lg sm:text-xl text-gray-900 dark:text-zinc-100 mb-1.5">
          Email Us
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-body mb-3">
          Drop us an email and we will respond promptly.
        </p>
        <a
          href="mailto:sayidolk@gmail.com"
          className="text-orange hover:text-orange/80 font-bold font-title text-base sm:text-lg transition-colors underline underline-offset-4"
        >
          sayidolk@gmail.com
        </a>
      </div>

      {/* Customer Service Hours Section */}
      <div className="bg-white dark:bg-darkSurface rounded-3xl border border-orange/20 dark:border-zinc-800 shadow-sm p-6 sm:p-8 text-center hover:shadow-md hover:border-orange/30 dark:hover:border-zinc-700 transition-all flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-orange/10 dark:bg-orange/20 text-orange flex items-center justify-center mb-4 border border-orange/15 shadow-xs">
          <FiClock className="text-2xl" />
        </div>
        <h3 className="font-title font-bold text-lg sm:text-xl text-gray-900 dark:text-zinc-100 mb-1.5">
          Customer Service Hours
        </h3>
        <p className="font-title font-bold text-base sm:text-lg text-gray-900 dark:text-zinc-100 mb-1">
          10:00 AM &ndash; 6:00 PM
        </p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-body">
          Monday &ndash; Friday (Excluding public holidays)
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
