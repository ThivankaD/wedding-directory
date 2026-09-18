"use-client";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import CategoryInput from "./CategoryInput";
import CityInput from "./CityInput";
import { Button } from "../ui/button";
import { FilterSearchBarProps } from "@/types/offeringTypes";

const FilterSearchBar: React.FC<FilterSearchBarProps> = ({
  onCategoryChange,
  onCityChange,
  handleSearch,
}) => {
  const [category, setCategory] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);
    onCategoryChange(selectedCategory);
  };

  const handleCityChange = (selectedCity: string) => {
    setCity(selectedCity);
    onCityChange(selectedCity);
  };

  const onSearch = () => {
    handleSearch(city || "", category || "");
  };

  return (
    <div className="flex items-center justify-center px-4 py-1">
      <div className="flex items-center bg-white shadow-xs rounded-full border-2 border-orange/20 w-full max-w-2xl h-[52px] px-3 sm:px-4 gap-2 sm:gap-3">
        {/* Category Input */}
        <div className="relative flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange/80 px-2 leading-none">
            Category
          </span>
          <CategoryInput onCategoryChange={handleCategoryChange} />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-orange/20 shrink-0" />

        {/* Location Input */}
        <div className="relative flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange/80 px-2 leading-none">
            Location
          </span>
          <CityInput placeholder="City" onCityChange={handleCityChange} />
        </div>

        {/* Search Button */}
        <button
          type="button"
          onClick={onSearch}
          className="w-9 h-9 rounded-full bg-orange hover:bg-orange/90 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs"
          title="Search vendors"
        >
          <IoIosSearch size={18} />
        </button>
      </div>
    </div>
  );
};

export default FilterSearchBar;
