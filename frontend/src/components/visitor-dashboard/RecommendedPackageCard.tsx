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
    <div className="bg-white dark:bg-darkSurface rounded-xl shadow-xs hover:shadow-md border border-orange/15 dark:border-zinc-800 hover:border-orange/40 dark:hover:border-orange/40 transition-all duration-200 overflow-hidden flex flex-col h-full group">
      {/* 1. Compact Package Image Container */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-gray-100 dark:bg-darkElevated shrink-0">
        <Image
          src={imgSrc}
          alt={packageName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc('/images/offeringPlaceholder.webp')}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10">
          {/* Category Tag */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs font-body">
            {item.category}
          </span>

          {/* Booking Requirement Badge */}
          {item.requiresApproval ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-xs font-body">
              <FiShield size={10} />
              <span>Approval Req.</span>
            </span>
          ) : item.requiresReservation ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-600/90 text-white backdrop-blur-md shadow-xs font-body">
              <FiClock size={10} />
              <span>Reservation Req.</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange text-white shadow-xs font-body">
              <Sparkles size={10} />
              <span>Top Match</span>
            </span>
          )}
        </div>

        {/* Bottom Overlay Info (Location & Rating) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-5 flex items-center justify-between text-white z-10 text-[11px] font-body">
          <div className="flex items-center gap-1 truncate">
            <FiMapPin className="text-orange shrink-0" size={12} />
            <span className="truncate">{item.city || item.location || 'Sri Lanka'}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/10 shrink-0">
            <FiStar className="text-amber-400 fill-amber-400" size={11} />
            <span className="font-semibold text-white text-[11px]">
              {item.rating > 0 ? item.rating.toFixed(1) : 'New'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Package Details & Body (Compact Sizing) */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-2.5">
        {/* Title & Vendor Meta */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange font-body block mb-0.5">
            Recommended Package
          </span>

          <Link
            href={serviceLink}
            className="font-title text-sm sm:text-base font-bold text-gray-900 dark:text-zinc-100 line-clamp-1 group-hover:text-orange transition-colors"
            title={packageName}
          >
            {packageName}
          </Link>

          <p className="text-[11px] text-gray-500 dark:text-zinc-400 font-body mt-0.5 truncate">
            By <span className="font-semibold text-gray-700 dark:text-zinc-300">{vendorName}</span> • {serviceName}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="bg-orange/[0.05] dark:bg-orange/[0.10] border border-orange/15 dark:border-zinc-800 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-body block">
              Package Price
            </span>
            {price !== null && price !== undefined && Number(price) > 0 && (
              <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium font-body">
                20% Advance:{' '}
                <span className="font-semibold text-gray-700 dark:text-zinc-200">
                  LKR {Math.round(Number(price) * 0.2).toLocaleString()}
                </span>
              </span>
            )}
          </div>
          <div className="text-base sm:text-lg font-bold font-title text-orange flex items-baseline gap-1 shrink-0">
            <span className="text-[10px] font-normal text-gray-500 dark:text-zinc-400 font-body">LKR</span>
            <span>{price !== null && price !== undefined ? Number(price).toLocaleString() : 'Quote'}</span>
          </div>
        </div>

        {/* Package Description */}
        {item.packageDescription && (
          <p className="text-[11px] text-gray-600 dark:text-zinc-400 font-body line-clamp-2 leading-relaxed">
            {item.packageDescription}
          </p>
        )}

        {/* Package Features Checklist (Up to 2 features for compact height) */}
        {item.packageFeatures && item.packageFeatures.length > 0 && (
          <div className="space-y-1 pt-0.5">
            <div className="space-y-1">
              {item.packageFeatures.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-700 dark:text-zinc-300 font-body">
                  <FiCheck className="text-emerald-500 shrink-0" size={12} />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Match Insight */}
        {item.reason && (
          <div className="p-2 rounded-lg bg-orange/[0.04] dark:bg-darkElevated border border-orange/15 dark:border-zinc-800 text-[11px] font-body">
            <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-zinc-100 mb-0.5">
              <Sparkles className="text-orange shrink-0" size={11} />
              <span className="text-[10px] uppercase tracking-wider text-orange">Why it fits:</span>
            </div>
            <p className="text-gray-600 dark:text-zinc-400 line-clamp-2 text-[11px] leading-relaxed">
              {item.reason}
            </p>
          </div>
        )}

        {/* AI Review Summary (if available) */}
        {source === 'ai' && item.aiReview && (
          <div className="p-2 rounded-lg bg-orange/[0.06] dark:bg-orange/[0.12] border border-orange/20 dark:border-orange/30 text-[11px] font-body">
            <div className="flex items-center gap-1 font-semibold text-orange mb-0.5">
              <Sparkles size={11} className="shrink-0" />
              <span className="text-[10px] uppercase tracking-wider">AI Review:</span>
            </div>
            <p className="text-gray-700 dark:text-zinc-300 italic line-clamp-2 text-[11px] leading-relaxed">
              &ldquo;{item.aiReview}&rdquo;
            </p>
          </div>
        )}

        {/* Card Footer / Action Button */}
        <div className="mt-auto pt-2 border-t border-orange/10 dark:border-zinc-800 flex items-center justify-between gap-2">
          <Link
            href={serviceLink}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-orange hover:bg-orange/90 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all shadow-xs font-body active:scale-[0.99]"
          >
            <span>View &amp; Book Package</span>
            <FiArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendedPackageCard;
