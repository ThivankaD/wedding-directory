'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import {
  FiMapPin,
  FiStar,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiClock,
} from 'react-icons/fi';

export interface RecommendedPackageItem {
  serviceId?: string;
  offeringId?: string;
  serviceName?: string;
  offeringName?: string;
  serviceSlug?: string;
  serviceBanner?: string | null;
  category: string;
  vendorName: string;
  city: string;
  location: string;
  rating: number;
  minPackagePrice?: number | null;
  packageId?: string | null;
  packageName?: string;
  packagePrice?: number | null;
  packageDescription?: string;
  packageImage?: string | null;
  packageFeatures?: string[];
  requiresReservation?: boolean;
  requiresApproval?: boolean;
  deterministicScore?: number;
  reason?: string;
  aiReview?: string;
}

interface RecommendedPackageCardProps {
  item: RecommendedPackageItem;
  source?: 'rules' | 'ai' | 'ai+rules' | null;
}

const RecommendedPackageCard: React.FC<RecommendedPackageCardProps> = ({ item, source }) => {
  const serviceId = item.serviceId || item.offeringId || '';
  const serviceSlug = item.serviceSlug || serviceId;
  const serviceName = item.serviceName || item.offeringName || 'Wedding Service';
  const packageName = item.packageName || 'Standard Package';
  const vendorName = item.vendorName || 'Wedding Vendor';
  const price = item.packagePrice ?? item.minPackagePrice ?? null;

  // Use package image first, then service banner, then fallback placeholder
  const initialImage = item.packageImage || item.serviceBanner || '/images/offeringPlaceholder.webp';
  const [imgSrc, setImgSrc] = useState<string>(initialImage);

  const serviceLink = `/services/${serviceSlug}`;

  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm hover:shadow-md border border-orange/15 dark:border-zinc-800 hover:border-orange/40 dark:hover:border-orange/40 transition-all duration-200 overflow-hidden flex flex-col h-full group">
      {/* 1. Package Image Container */}
      <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-gray-100 dark:bg-darkElevated">
        <Image
          src={imgSrc}
          alt={packageName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc('/images/offeringPlaceholder.webp')}
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          {/* Category Tag */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs font-body">
            {item.category}
          </span>

          {/* Booking Requirement Badge */}
          {item.requiresApproval ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-xs font-body">
              <FiShield size={12} />
              <span>Requires Approval</span>
            </span>
          ) : item.requiresReservation ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-600/90 text-white backdrop-blur-md shadow-xs font-body">
              <FiClock size={12} />
              <span>Requires Reservation</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange text-white shadow-xs font-body">
              <Sparkles size={12} />
              <span>Top Match</span>
            </span>
          )}
        </div>

        {/* Bottom Overlay Info (Location & Rating) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-3 pt-8 flex items-center justify-between text-white z-10 text-xs font-body">
          <div className="flex items-center gap-1.5 truncate">
            <FiMapPin className="text-orange shrink-0" size={14} />
            <span className="truncate">{item.city || item.location || 'Sri Lanka'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 shrink-0">
            <FiStar className="text-amber-400 fill-amber-400" size={13} />
            <span className="font-semibold text-white">
              {item.rating > 0 ? item.rating.toFixed(1) : 'New'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Package Details & Body */}
      <div className="p-5 flex flex-col flex-1 gap-3.5">
        {/* Title & Vendor Meta */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange font-body">
              Recommended Package
            </span>
          </div>

          <Link
            href={serviceLink}
            className="font-title text-lg sm:text-xl font-bold text-gray-900 dark:text-zinc-100 line-clamp-1 group-hover:text-orange transition-colors"
          >
            {packageName}
          </Link>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-body mt-0.5 truncate">
            By <span className="font-semibold text-gray-700 dark:text-zinc-300">{vendorName}</span> • {serviceName}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="bg-orange/[0.05] dark:bg-orange/[0.10] border border-orange/20 dark:border-zinc-800 rounded-xl px-4 py-2.5 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider font-body">
            Package Price
          </span>
          <div className="text-2xl font-bold font-title text-orange flex items-baseline gap-1">
            <span className="text-xs font-normal text-gray-500 dark:text-zinc-400 font-body">LKR</span>
            <span>{price !== null && price !== undefined ? Number(price).toLocaleString() : 'Contact for Quote'}</span>
          </div>
        </div>

        {/* Package Description */}
        {item.packageDescription && (
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 font-body line-clamp-2">
            {item.packageDescription}
          </p>
        )}

        {/* Package Features Checklist */}
        {item.packageFeatures && item.packageFeatures.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-body">
              Package Highlights
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {item.packageFeatures.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-zinc-300 font-body">
                  <FiCheck className="text-emerald-500 shrink-0" size={13} />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI / Match Insights */}
        {item.reason && (
          <div className="p-3 rounded-xl bg-orange/[0.04] dark:bg-darkElevated border border-orange/15 dark:border-zinc-800 text-xs font-body">
            <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-zinc-100 mb-0.5">
              <Sparkles className="text-orange" size={13} />
              <span>Why it fits your wedding:</span>
            </div>
            <p className="text-gray-600 dark:text-zinc-400 pl-4">{item.reason}</p>
          </div>
        )}

        {/* AI Review Summary */}
        {source === 'ai' && item.aiReview && (
          <div className="p-3 rounded-xl bg-orange/[0.06] dark:bg-orange/[0.12] border border-orange/20 dark:border-orange/30 text-xs font-body">
            <div className="flex items-center gap-1.5 font-semibold text-orange mb-0.5">
              <Sparkles size={13} />
              <span>AI Review Summary:</span>
            </div>
            <p className="text-gray-700 dark:text-zinc-300 pl-4 italic">&ldquo;{item.aiReview}&rdquo;</p>
          </div>
        )}

        {/* Card Footer / Action Button */}
        <div className="mt-auto pt-3 border-t border-orange/10 dark:border-zinc-800 flex items-center justify-between gap-3">
          <Link
            href={serviceLink}
            className="w-full inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange/90 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs font-body active:scale-[0.99]"
          >
            <span>View &amp; Book Package</span>
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendedPackageCard;
