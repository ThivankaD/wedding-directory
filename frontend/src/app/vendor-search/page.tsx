"use client";

import React, { useState, useCallback, useEffect } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Headers/Header";
import OfferingCard from "@/components/vendor-search/OfferingCard";
// import { Button } from "@/components/ui/button";
import { FIND_SERVICES } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import FilterSearchBar from "@/components/vendor-search/FilterSearchBar";
import { Offering } from '@/types/offeringTypes';
import LoaderJelly from "@/components/shared/Loaders/LoaderJelly";
import Chatbot from "@/components/ai/chatbot";

const VendorSearch: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  // useLazyQuery hook to fetch services on demand
  const [getServices, { loading, data, error }] = useLazyQuery(FIND_SERVICES);

  // Trigger search when the button is clicked or filters change
  const handleSearch = useCallback(() => {
    if (getServices) {
      getServices({
        variables: {
          filter: {
            city: city || null,
            category: category || null,
          },
        },
      });
    } else {
      console.error("getServices is not initialized");
    }
  }, [city, category, getServices]);

    // Load initial data when component mounts
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Handlers for filter changes
  const handleCityChange = useCallback((newCity: string) => {
    setCity(newCity);
  }, []);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  return (
    <div className="bg-lightYellow font-title min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 text-center w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find the perfect crew for your wedding
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">
            Filter by Category and Location
          </p>
        </div>

        <FilterSearchBar
          handleSearch={handleSearch}
          onCityChange={handleCityChange}
          onCategoryChange={handleCategoryChange}
        />

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
            ) : data?.findOfferings?.filter((offering: Offering) => offering.visible)?.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="font-title font-bold text-xl sm:text-2xl text-gray-900">
                      Available Vendors
                    </h2>
                    <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-orange/10 text-orange border border-orange/20 font-body">
                      {data.findOfferings.filter((offering: Offering) => offering.visible).length} found
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.findOfferings
                    .filter((offering: Offering) => offering.visible)
                    .map((offering: Offering) => (
                      <OfferingCard
                        key={offering.id}
                        name={offering.name}
                        vendor={offering.vendor?.busname || "N/A"}
                        city={offering.vendor?.city || "N/A"}
                        banner={offering.banner || "/images/offeringPlaceholder.webp"}
                        rating={
                          offering.reviews.length > 0
                            ? offering.reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
                              offering.reviews.length
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
                  Try adjusting your city or category filter to discover more wedding services.
                </p>
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

export default VendorSearch;
