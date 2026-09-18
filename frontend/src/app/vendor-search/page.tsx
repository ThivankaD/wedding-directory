"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Headers/Header";
import OfferingCard from "@/components/vendor-search/OfferingCard";
import { FIND_SERVICES } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import FilterSearchBar from "@/components/vendor-search/FilterSearchBar";
import { Offering } from "@/types/offeringTypes";
import LoaderJelly from "@/components/shared/Loaders/LoaderJelly";
import Chatbot from "@/components/ai/chatbot";
import { IoClose } from "react-icons/io5";

const VendorSearchContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category") || "";
  const urlCity = searchParams.get("city") || "";
  const urlQuery = searchParams.get("q") || "";

  const [city, setCity] = useState<string>(urlCity);
  const [category, setCategory] = useState<string>(urlCategory);
  const [keyword, setKeyword] = useState<string>(urlQuery);

  // useLazyQuery hook to fetch services on demand
  const [getServices, { loading, data, error }] = useLazyQuery(FIND_SERVICES);

  // Trigger search with given filters or current state
  const handleSearch = useCallback(
    (targetCity?: string, targetCategory?: string) => {
      const activeCity = targetCity !== undefined ? targetCity : city;
      const activeCategory =
        targetCategory !== undefined ? targetCategory : category;

      if (getServices) {
        getServices({
          variables: {
            filter: {
              city: activeCity || null,
              category: activeCategory || null,
            },
          },
        });
      }
    },
    [city, category, getServices]
  );

  // Sync state and run search when URL query parameters change
  useEffect(() => {
    setCategory(urlCategory);
    setCity(urlCity);
    setKeyword(urlQuery);
    handleSearch(urlCity, urlCategory);
  }, [urlCategory, urlCity, urlQuery, handleSearch]);

  // Handlers for filter changes from FilterSearchBar
  const handleCityChange = useCallback((newCity: string) => {
    setCity(newCity);
  }, []);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  // Filter removal helpers
  const removeCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    setCategory("");
    router.push(`/vendor-search?${params.toString()}`);
  };

  const removeCity = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("city");
    setCity("");
    router.push(`/vendor-search?${params.toString()}`);
  };

  const removeKeyword = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    setKeyword("");
    router.push(`/vendor-search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setCategory("");
    setCity("");
    setKeyword("");
    router.push("/vendor-search");
  };

  // Filter offerings by visibility and keyword query
  const visibleOfferings = (data?.findOfferings || []).filter(
    (offering: Offering) => {
      if (!offering.visible) return false;

      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchName = offering.name?.toLowerCase().includes(q);
        const matchBus = offering.vendor?.busname?.toLowerCase().includes(q);
        const matchCat = offering.category?.toLowerCase().includes(q);
        const matchCity = offering.vendor?.city?.toLowerCase().includes(q);
        const matchDesc = offering.description?.toLowerCase().includes(q);
        if (!matchName && !matchBus && !matchCat && !matchCity && !matchDesc) {
          return false;
        }
      }

      return true;
    }
  );

  const hasActiveFilters = Boolean(category || city || keyword);

  return (
    <div className="bg-lightYellow font-title min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 text-center w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find the perfect crew for your wedding
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">
            Filter by Category, Location, or Keyword
          </p>
        </div>

        <FilterSearchBar
          handleSearch={handleSearch}
          onCityChange={handleCityChange}
          onCategoryChange={handleCategoryChange}
          selectedCategory={category}
          selectedCity={city}
        />

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 w-full flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-gray-500 font-body mr-1">
              Active filters:
            </span>

            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange/15 text-orange border border-orange/25 font-body">
                <span>Service: {category}</span>
                <button
                  type="button"
                  onClick={removeCategory}
                  className="hover:text-gray-900 p-0.5 rounded-full hover:bg-orange/20 transition-colors"
                  title="Remove category filter"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange/15 text-orange border border-orange/25 font-body">
                <span>City: {city}</span>
                <button
                  type="button"
                  onClick={removeCity}
                  className="hover:text-gray-900 p-0.5 rounded-full hover:bg-orange/20 transition-colors"
                  title="Remove city filter"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {keyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange/15 text-orange border border-orange/25 font-body">
                <span>Keyword: &quot;{keyword}&quot;</span>
                <button
                  type="button"
                  onClick={removeKeyword}
                  className="hover:text-gray-900 p-0.5 rounded-full hover:bg-orange/20 transition-colors"
                  title="Remove keyword search"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-semibold text-gray-500 hover:text-orange underline ml-2 font-body transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="border-b border-orange/15 my-4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          {/* Main Content - Full Width Catalog */}
          <div className="w-full">
            {/* Data Loading/Error/Result State */}
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <LoaderJelly />
                <p className="text-xs font-semibold text-gray-500 font-body mt-3">
                  Finding wedding vendors...
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl border-2 border-rose-200 p-8 text-center my-6 max-w-md mx-auto">
                <p className="text-rose-600 font-medium text-sm font-body">
                  Oops! We encountered an issue loading vendors. Please try again in a moment.
                </p>
              </div>
            ) : visibleOfferings.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="font-title font-bold text-xl sm:text-2xl text-gray-900">
                      Available Vendors
                    </h2>
                    <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-orange/10 text-orange border border-orange/20 font-body">
                      {visibleOfferings.length} found
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleOfferings.map((offering: Offering) => (
                    <OfferingCard
                      key={offering.id}
                      name={offering.name}
                      vendor={offering.vendor?.busname || "N/A"}
                      city={offering.vendor?.city || "N/A"}
                      banner={offering.banner || "/images/offeringPlaceholder.webp"}
                      rating={
                        offering.reviews.length > 0
                          ? offering.reviews.reduce(
                              (acc, review) => acc + Number(review.rating),
                              0
                            ) / offering.reviews.length
                          : 0
                      }
                      buttonText="View Details"
                      link={`/services/${offering.id}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-orange/20 p-12 text-center my-8 shadow-xs max-w-md mx-auto">
                <h3 className="font-title font-bold text-lg text-gray-900 mb-1">
                  No vendors found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-body">
                  Try adjusting your city, category, or keyword search to discover more wedding services.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 rounded-full bg-orange text-white text-xs font-semibold hover:bg-orange/90 transition-all shadow-xs"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
};

const VendorSearch: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-lightYellow flex flex-col items-center justify-center p-8">
          <LoaderJelly />
        </div>
      }
    >
      <VendorSearchContent />
    </Suspense>
  );
};

export default VendorSearch;
