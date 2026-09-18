import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiExternalLink } from "react-icons/fi";

interface VendorCardProps {
  name: string;
  vendor: string;
  city: string;
  banner: string;
  link: string;
}

const VendorCard = ({ name, vendor, city, banner, link }: VendorCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border-2 border-orange/20 hover:border-orange bg-white shadow-xs hover:shadow-md transition-all group w-full">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl bg-orange/5 border border-orange/10">
          <Image
            src={banner}
            alt={`${name} banner`}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 96px) 100vw, 96px"
          />
        </div>

        <div className="flex-grow min-w-0">
          <span className="inline-block text-xs font-bold text-orange uppercase tracking-wider mb-0.5">
            {vendor}
          </span>
          <h3 className="font-title text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange transition-colors truncate">
            {name}
          </h3>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-1">
            <FiMapPin className="text-orange shrink-0" size={13} />
            <span className="truncate">{city}</span>
          </p>
        </div>
      </div>

      <Link
        href={link}
        className="self-end sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-orange hover:bg-orange/90 shadow-xs transition-all flex-shrink-0"
      >
        <span>View Details</span>
        <FiExternalLink size={14} />
      </Link>
    </div>
  );
};

export default VendorCard;