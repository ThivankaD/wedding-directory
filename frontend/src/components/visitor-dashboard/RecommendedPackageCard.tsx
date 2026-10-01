'use client';

import React, { useState, useEffect } from 'react';
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
  FiEye,
  FiX,
  FiExternalLink,
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Close modal on Escape key and prevent background scroll when open
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <>
      {/* ======================================================== */}
      {/* 1. LIGHTWEIGHT, STREAMLINED CARD */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-xs hover:shadow-md border border-orange/15 dark:border-zinc-800 hover:border-orange/40 dark:hover:border-orange/40 transition-all duration-200 overflow-hidden flex flex-col h-full group">
        {/* Package Image Container */}
        <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-gray-100 dark:bg-darkElevated shrink-0">
          <Image
            src={imgSrc}
            alt={packageName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc('/images/offeringPlaceholder.webp')}
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs font-body">
              {item.category}
            </span>

            {item.requiresApproval ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-xs font-body">
                <FiShield size={11} />
                <span>Approval Req.</span>
              </span>
            ) : item.requiresReservation ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-600/90 text-white backdrop-blur-md shadow-xs font-body">
                <FiClock size={11} />
                <span>Reservation Req.</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange text-white shadow-xs font-body">
                <Sparkles size={11} />
                <span>Top Match</span>
              </span>
            )}
          </div>

          {/* Bottom Overlay Info (Location & Rating) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-6 flex items-center justify-between text-white z-10 text-[11px] font-body">
            <div className="flex items-center gap-1 truncate">
              <FiMapPin className="text-orange shrink-0" size={12} />
              <span className="truncate">{item.city || item.location || 'Sri Lanka'}</span>
            </div>

            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 shrink-0">
              <FiStar className="text-amber-400 fill-amber-400" size={11} />
              <span className="font-semibold text-white text-[11px]">
                {item.rating > 0 ? item.rating.toFixed(1) : 'New'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          {/* Header & Meta */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange font-body block mb-1">
              Recommended Package
            </span>

            <h3
              onClick={() => setIsModalOpen(true)}
              className="font-title text-base sm:text-lg font-bold text-gray-900 dark:text-zinc-100 line-clamp-1 group-hover:text-orange transition-colors cursor-pointer"
              title={packageName}
            >
              {packageName}
            </h3>

            <p className="text-xs text-gray-500 dark:text-zinc-400 font-body mt-0.5 truncate">
              By <span className="font-semibold text-gray-700 dark:text-zinc-300">{vendorName}</span> • {serviceName}
            </p>
          </div>

          {/* Clean Pricing Block */}
          <div className="bg-orange/[0.05] dark:bg-orange/[0.10] border border-orange/15 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-body block">
                Total Package Price
              </span>
              {price !== null && price !== undefined && Number(price) > 0 && (
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium font-body block mt-0.5">
                  20% Advance:{' '}
                  <span className="font-semibold text-gray-700 dark:text-zinc-200">
                    LKR {Math.round(Number(price) * 0.2).toLocaleString()}
                  </span>
                </span>
              )}
            </div>
            <div className="text-lg font-bold font-title text-orange flex items-baseline gap-1 shrink-0">
              <span className="text-[10px] font-normal text-gray-500 dark:text-zinc-400 font-body">LKR</span>
              <span>{price !== null && price !== undefined ? Number(price).toLocaleString() : 'Quote'}</span>
            </div>
          </div>

          {/* Single-line concise highlight */}
          {item.reason && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-400 font-body truncate">
              <Sparkles className="text-orange shrink-0" size={13} />
              <span className="truncate">{item.reason}</span>
            </div>
          )}

          {/* Action Buttons: Details Modal + Redirect to Service */}
          <div className="pt-2 border-t border-orange/10 dark:border-zinc-800 grid grid-cols-2 gap-2 mt-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-orange/30 dark:border-zinc-700 bg-orange/5 dark:bg-darkElevated hover:bg-orange/10 hover:border-orange text-orange transition-all font-body active:scale-[0.98] cursor-pointer"
            >
              <FiEye size={13} />
              <span>Details</span>
            </button>

            <Link
              href={serviceLink}
              className="inline-flex items-center justify-center gap-1.5 bg-orange hover:bg-orange/90 text-white py-2 px-3 rounded-xl text-xs font-semibold transition-all shadow-xs font-body active:scale-[0.98]"
            >
              <span>View Service</span>
              <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. RICH DETAILS POPUP MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-darkSurface rounded-3xl border border-orange/20 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col font-body animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Media Banner */}
            <div className="relative w-full h-44 sm:h-52 bg-gray-100 dark:bg-darkElevated shrink-0">
              <Image
                src={imgSrc}
                alt={packageName}
                fill
                className="object-cover"
                onError={() => setImgSrc('/images/offeringPlaceholder.webp')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20 cursor-pointer"
                title="Close modal"
              >
                <FiX size={18} />
              </button>

              {/* Top Badges in Modal */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs font-body">
                  {item.category}
                </span>

                {item.requiresApproval ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-xs">
                    <FiShield size={12} />
                    <span>Requires Approval</span>
                  </span>
                ) : item.requiresReservation ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-600/90 text-white backdrop-blur-md shadow-xs">
                    <FiClock size={12} />
                    <span>Requires Reservation</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange text-white shadow-xs">
                    <Sparkles size={12} />
                    <span>Top Match</span>
                  </span>
                )}
              </div>

              {/* Bottom overlay with Location & Rating */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between text-white z-10 text-xs">
                <div className="flex items-center gap-1.5">
                  <FiMapPin className="text-orange" size={14} />
                  <span>{item.city || item.location || 'Sri Lanka'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                  <FiStar className="text-amber-400 fill-amber-400" size={13} />
                  <span className="font-semibold text-white">
                    {item.rating > 0 ? `${item.rating.toFixed(1)} / 5.0` : 'New'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange font-body block mb-1">
                  Package Overview
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-title text-gray-900 dark:text-zinc-100">
                  {packageName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                  Offered by <span className="font-semibold text-gray-700 dark:text-zinc-300">{vendorName}</span> under{' '}
                  <span className="font-medium text-orange">{serviceName}</span>
                </p>
              </div>

              {/* Pricing Box */}
              <div className="bg-orange/[0.05] dark:bg-orange/[0.10] border border-orange/20 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider block">
                    Full Package Price
                  </span>
                  {price !== null && price !== undefined && Number(price) > 0 && (
                    <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium block mt-1">
                      20% Advance to Reserve:{' '}
                      <span className="font-bold text-gray-800 dark:text-zinc-100">
                        LKR {Math.round(Number(price) * 0.2).toLocaleString()}
                      </span>
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold font-title text-orange flex items-baseline gap-1">
                  <span className="text-xs font-normal text-gray-500 dark:text-zinc-400">LKR</span>
                  <span>{price !== null && price !== undefined ? Number(price).toLocaleString() : 'Quote'}</span>
                </div>
              </div>

              {/* Package Description */}
              {item.packageDescription && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Description
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed bg-gray-50 dark:bg-darkElevated p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800">
                    {item.packageDescription}
                  </p>
                </div>
              )}

              {/* Package Features Checklist */}
              {item.packageFeatures && item.packageFeatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Included Package Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.packageFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-darkElevated px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-800"
                      >
                        <FiCheck className="text-emerald-500 shrink-0" size={14} />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Why it fits */}
              {item.reason && (
                <div className="p-3.5 rounded-2xl bg-orange/[0.04] dark:bg-darkElevated border border-orange/15 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                    <Sparkles className="text-orange" size={14} />
                    <span>Why AI matched this with your wedding:</span>
                  </div>
                  <p className="text-gray-600 dark:text-zinc-400 pl-5">{item.reason}</p>
                </div>
              )}

              {/* AI Review */}
              {source === 'ai' && item.aiReview && (
                <div className="p-3.5 rounded-2xl bg-orange/[0.06] dark:bg-orange/[0.12] border border-orange/20 dark:border-orange/30 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-orange mb-1">
                    <Sparkles size={14} />
                    <span>AI Review Summary:</span>
                  </div>
                  <p className="text-gray-700 dark:text-zinc-300 pl-5 italic">&ldquo;{item.aiReview}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Modal Bottom Fixed CTA */}
            <div className="p-4 sm:p-5 border-t border-orange/10 dark:border-zinc-800 bg-gray-50/50 dark:bg-darkElevated/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>

              <Link
                href={serviceLink}
                className="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange/90 text-white py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-orange/20 font-body active:scale-[0.99]"
              >
                <span>Go to Service Page &amp; Book</span>
                <FiExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendedPackageCard;
