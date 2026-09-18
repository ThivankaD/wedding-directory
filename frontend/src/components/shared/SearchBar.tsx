"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import { FiGrid, FiMapPin } from "react-icons/fi";
import { SearchBarProps } from "@/types/homeTypes";
import categories from "../../utils/category.json";
import citiesData from "../../utils/city.json";
import { useRouter } from "next/navigation";

const SearchBar: React.FC<SearchBarProps> = ({
  showIcon = true,
  placehHolderText = "Search venues, photographers, Colombo...",
  className = "",
}) => {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Memoize unique city list
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(citiesData.map((c) => c.City))).sort();
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input change and search filtering
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const q = value.toLowerCase().trim();
      const matchedCats = categories.filter((category) =>
        category.toLowerCase().includes(q)
      );
      const matchedCities = uniqueCities
        .filter((city) => city.toLowerCase().includes(q))
        .slice(0, 4);

      setFilteredCategories(matchedCats);
      setFilteredCities(matchedCities);
      setIsOpen(matchedCats.length > 0 || matchedCities.length > 0);
    } else {
      setFilteredCategories([]);
      setFilteredCities([]);
      setIsOpen(false);
    }
  };

  // Submit search query
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchTerm.trim();
    setIsOpen(false);

    if (!q) {
      router.push("/vendor-search");
      return;
    }

    // Exact or case-insensitive category match
    const exactCat = categories.find(
      (cat) => cat.toLowerCase() === q.toLowerCase()
    );
    if (exactCat) {
      router.push(`/vendor-search?category=${encodeURIComponent(exactCat)}`);
      return;
    }

    // Exact or case-insensitive city match
    const exactCity = uniqueCities.find(
      (city) => city.toLowerCase() === q.toLowerCase()
    );
    if (exactCity) {
      router.push(`/vendor-search?city=${encodeURIComponent(exactCity)}`);
      return;
    }

    // First filtered category if available
    if (filteredCategories.length > 0) {
      router.push(
        `/vendor-search?category=${encodeURIComponent(filteredCategories[0])}`
      );
      return;
    }

    // First filtered city if available
    if (filteredCities.length > 0) {
      router.push(`/vendor-search?city=${encodeURIComponent(filteredCities[0])}`);
      return;
    }

    // Generic search query for vendor names, service titles, or descriptions
    router.push(`/vendor-search?q=${encodeURIComponent(q)}`);
  };

  const handleSelectCategory = (cat: string) => {
    setSearchTerm(cat);
    setIsOpen(false);
    router.push(`/vendor-search?category=${encodeURIComponent(cat)}`);
  };

  const handleSelectCity = (city: string) => {
    setSearchTerm(city);
    setIsOpen(false);
    router.push(`/vendor-search?city=${encodeURIComponent(city)}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredCategories([]);
    setFilteredCities([]);
    setIsOpen(false);
  };

  const hasSuggestions =
    isOpen && (filteredCategories.length > 0 || filteredCities.length > 0);

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          type="text"
          placeholder={placehHolderText}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (
              searchTerm.trim() &&
              (filteredCategories.length > 0 || filteredCities.length > 0)
            ) {
              setIsOpen(true);
            }
          }}
          className={`w-full py-2 text-xs sm:text-sm rounded-full border border-orange/25 bg-white/95 focus:bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all shadow-xs font-body ${
            showIcon ? "pl-9" : "pl-4"
          } ${searchTerm ? "pr-16" : "pr-9"}`}
        />

        {showIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <MdSearch className="w-5 h-5" />
          </div>
        )}

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-9 flex items-center pr-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear search"
          >
            <MdClose className="w-4 h-4" />
          </button>
        )}

        {/* Action Button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-1.5 my-auto w-7 h-7 rounded-full bg-orange hover:bg-orange/90 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
          title="Search"
        >
          <MdSearch className="w-4 h-4" />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {hasSuggestions && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-orange/20 overflow-hidden z-50 font-body divide-y divide-orange/10 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Categories */}
          {filteredCategories.length > 0 && (
            <div className="p-1.5">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange/80 flex items-center gap-1.5">
                <FiGrid className="w-3 h-3" /> Services
              </div>
              <div className="space-y-0.5">
                {filteredCategories.slice(0, 5).map((category, index) => (
                  <button
                    key={`cat-${index}`}
                    type="button"
                    onClick={() => handleSelectCategory(category)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-800 hover:bg-orange/10 hover:text-orange flex items-center justify-between transition-colors group"
                  >
                    <span>{category}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20 opacity-80 group-hover:opacity-100">
                      Service
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cities */}
          {filteredCities.length > 0 && (
            <div className="p-1.5">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange/80 flex items-center gap-1.5">
                <FiMapPin className="w-3 h-3" /> Locations
              </div>
              <div className="space-y-0.5">
                {filteredCities.map((city, index) => (
                  <button
                    key={`city-${index}`}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-800 hover:bg-orange/10 hover:text-orange flex items-center justify-between transition-colors group"
                  >
                    <span>{city}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 group-hover:bg-orange/10 group-hover:text-orange group-hover:border-orange/20">
                      City
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
