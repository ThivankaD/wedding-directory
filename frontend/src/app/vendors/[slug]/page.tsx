"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import OfferingCard from "@/components/vendor-search/OfferingCard";
import { ServiceDetailSkeleton } from "@/components/ui/shimmer";
import { OfferingGridSkeleton } from "@/components/ui/shimmer";
import {
  FIND_VENDOR_BY_SLUG,
  FIND_VENDOR_SERVICES_BY_ID,
  GET_VENDOR_BY_ID,
} from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { getServiceUrl } from "@/utils/serviceUrl";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiMapPin, FiCalendar } from "react-icons/fi";

// Detect whether the slug param is a UUID or a human-readable slug
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VendorPublicPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slugParam = (params?.slug as string) || "";

  const isUUID = UUID_REGEX.test(slugParam);

  // Try slug-based lookup (for human-readable slugs)
  const {
    data: slugData,
    loading: slugLoading,
    error: slugError,
  } = useQuery(FIND_VENDOR_BY_SLUG, {
    variables: { slug: slugParam },
    skip: isUUID,
    fetchPolicy: "cache-and-network",
  });

  // ID-based lookup — runs when param is a UUID, or as fallback when slug lookup fails
  const {
    data: idData,
    loading: idLoading,
    error: idError,
  } = useQuery(GET_VENDOR_BY_ID, {
    variables: { id: slugParam },
    skip: !isUUID && !slugError,
    fetchPolicy: "cache-and-network",
  });

  // Resolve the vendor from whichever query returned data
  const vendor =
    slugData?.findVendorBySlug || idData?.findVendorById || null;

  const vendorId = vendor?.id || null;

  // If we loaded by UUID but the vendor has a slug, redirect to the canonical slug URL
  useEffect(() => {
    if (vendor?.slug && isUUID) {
      router.replace(`/vendors/${vendor.slug}`);
    }
  }, [vendor?.slug, isUUID, router]);

  // Fetch the vendor's services once we have their ID
  const { data: servicesData, loading: servicesLoading } = useQuery(
    FIND_VENDOR_SERVICES_BY_ID,
    {
      variables: { id: vendorId },
      skip: !vendorId,
      fetchPolicy: "cache-and-network",
    },
  );

  const allServices = servicesData?.findServicesByVendor || [];
  const visibleServices = useMemo(
    () => allServices.filter((s: any) => s.visible !== false),
    [allServices],
  );

  // Set browser tab title
  useEffect(() => {
    if (vendor?.busname) {
      document.title = `${vendor.busname} | Say I Do`;
    }
  }, [vendor]);

  const isLoading = isUUID ? idLoading : slugLoading && !slugError;

  const notFound = !isLoading && !vendor;

  // Profile picture state
  const [imgError, setImgError] = React.useState(false);
  const profilePic =
    !imgError && vendor?.profile_pic_url ? vendor.profile_pic_url : null;

  if (isLoading) {
    return <ServiceDetailSkeleton />;
  }

  if (notFound || (!isLoading && (isUUID ? idError : slugError && idError))) {
    return (
      <div className="bg-lightYellow dark:bg-darkBg font-body min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-darkSurface rounded-3xl border-2 border-orange/20 dark:border-zinc-800 p-12 text-center max-w-md w-full shadow-xs">
            <h2 className="font-title font-bold text-xl text-gray-900 dark:text-zinc-100 mb-2">
              Vendor Not Found
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-body mb-6">
              We couldn&apos;t find this vendor. They may have changed their
              profile URL or been removed.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all shadow-xs"
            >
              Browse all services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const joinedYear = vendor?.createdAt
    ? new Date(vendor.createdAt).getFullYear()
    : null;

  return (
    <div className="bg-lightYellow dark:bg-darkBg font-body min-h-screen flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
          {/* Back link */}
          <div className="mb-4 pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-orange dark:hover:text-orange transition-colors group"
            >
              <FiArrowLeft className="text-base group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Services</span>
            </Link>
          </div>

          {/* Vendor Profile Card */}
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Profile Picture / Initial Avatar */}
              <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-orange/10 dark:bg-orange/5 border-2 border-orange/20 dark:border-orange/20">
                {profilePic ? (
                  <Image
                    src={profilePic}
                    alt={vendor.busname}
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-title font-bold text-orange">
                      {(vendor?.busname?.[0] || "V").toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-title text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-100">
                    {vendor.busname}
                  </h1>
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange/10 dark:bg-orange/15 text-orange">
                    Vendor
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                  {vendor.city && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-400">
                      <FiMapPin className="text-orange flex-shrink-0" />
                      <span>{vendor.city}</span>
                    </div>
                  )}
                  {joinedYear && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-400">
                      <FiCalendar className="text-orange flex-shrink-0" />
                      <span>Member since {joinedYear}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About section */}
            {vendor.about && (
              <>
                <div className="border-t border-gray-100 dark:border-zinc-800 my-5" />
                <div>
                  <h2 className="font-title font-bold text-base text-gray-900 dark:text-zinc-100 mb-2">
                    About
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                    {vendor.about}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Services section */}
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-title font-bold text-xl sm:text-2xl text-gray-900 dark:text-zinc-100">
                  {visibleServices.length > 0
                    ? "Services offered"
                    : "No services available"}
                </h2>
                {visibleServices.length > 0 && (
                  <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-orange/10 dark:bg-orange/15 text-orange border border-orange/20 dark:border-orange/25 font-body">
                    {visibleServices.length}{" "}
                    {visibleServices.length === 1 ? "service" : "services"}
                  </span>
                )}
              </div>
            </div>

            {servicesLoading ? (
              <OfferingGridSkeleton count={4} />
            ) : visibleServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleServices.map((service: any) => {
                  const avgRating =
                    service.reviews?.length > 0
                      ? service.reviews.reduce(
                          (acc: number, r: any) => acc + Number(r.rating),
                          0,
                        ) / service.reviews.length
                      : 0;

                  return (
                    <OfferingCard
                      key={service.id}
                      id={service.id}
                      name={service.name}
                      vendor={vendor.busname}
                      vendorId={vendor.id}
                      vendorSlug={vendor.slug}
                      hideVendor
                      city={service.city || vendor.city || ""}
                      banner={
                        service.banner || "/images/offeringPlaceholder.webp"
                      }
                      rating={avgRating}
                      buttonText="View Details"
                      link={getServiceUrl(service)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-darkSurface rounded-3xl border-2 border-orange/20 dark:border-zinc-800 p-12 text-center shadow-xs max-w-md mx-auto">
                <p className="text-sm text-gray-500 dark:text-zinc-400 font-body">
                  This vendor hasn&apos;t listed any services yet.
                </p>
                <Link
                  href="/services"
                  className="mt-4 inline-block px-4 py-2 rounded-full bg-orange text-white text-xs font-semibold hover:bg-orange/90 transition-all shadow-xs"
                >
                  Browse all services
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorPublicPage;
