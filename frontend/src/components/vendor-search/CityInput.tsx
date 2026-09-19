"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import cities from "../../utils/city.json";
import { CityProps } from "@/types/signupInput";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CityInput: React.FC<CityProps> = ({ onCityChange, value }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(value || null);

  useEffect(() => {
    setSelectedCity(value || null);
  }, [value]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city ? city : null);
    onCityChange(city);
  };

  const provinces = [...new Set(cities.map((city) => city.Province))];

  const getDistrictsByProvince = (province: string) => {
    return [
      ...new Set(
        cities
          .filter((city) => city.Province === province)
          .map((city) => city.District)
      ),
    ];
  };

  const getCitiesByDistrict = (district: string) => {
    return cities
      .filter((city) => city.District === district)
      .map((city) => city.City);
  };

  return (
    <div className="w-full font-body">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex justify-between items-center w-full text-left px-2 py-0 text-gray-800 dark:text-zinc-100 bg-transparent hover:bg-transparent transition duration-150 font-medium text-xs sm:text-sm h-7 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none dark:focus:ring-0 dark:focus:ring-offset-0 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0 dark:focus-visible:outline-none border-none rounded-none shadow-none outline-none ring-0 cursor-pointer"
          >
            <span className="font-body font-medium truncate">
              {selectedCity || "Select City"}
            </span>
            <ChevronDown className="ml-1 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/95 dark:bg-darkElevated/95 backdrop-blur-sm rounded-xl shadow-lg max-h-60 overflow-y-auto font-body z-10 border border-orange/15 dark:border-zinc-700">
          <DropdownMenuLabel className="font-body px-4 py-2 text-gray-500 dark:text-zinc-400">
            Find Your City
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleCitySelect("")}
            className="px-4 py-2 text-gray-500 dark:text-zinc-400 italic hover:bg-orange/10 dark:hover:bg-orange/20 hover:text-orange rounded-lg cursor-pointer transition duration-150"
          >
            All Cities
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-zinc-700" />
          <DropdownMenuGroup>
            {provinces.map((province, provinceIndex) => (
              <DropdownMenuSub key={provinceIndex}>
                <DropdownMenuSubTrigger className="px-4 py-2 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-darkSurface rounded-lg cursor-pointer transition duration-150">
                  {province}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-white/90 dark:bg-darkElevated/95 rounded-lg shadow-lg backdrop-blur-sm max-h-60 overflow-y-auto border border-orange/15 dark:border-zinc-700">
                    {getDistrictsByProvince(province).map(
                      (district, districtIndex) => (
                        <DropdownMenuSub key={districtIndex}>
                          <DropdownMenuSubTrigger className="px-4 py-2 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-darkSurface rounded-lg cursor-pointer transition duration-150">
                            {district}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-white/90 dark:bg-darkElevated/95 rounded-lg shadow-lg backdrop-blur-sm max-h-60 overflow-y-auto border border-orange/15 dark:border-zinc-700">
                              {getCitiesByDistrict(district).map(
                                (city, cityIndex) => (
                                  <DropdownMenuItem
                                    key={cityIndex}
                                    onClick={() => handleCitySelect(city)}
                                    className="px-4 py-2 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-darkSurface rounded-lg cursor-pointer transition duration-150"
                                  >
                                    {city}
                                  </DropdownMenuItem>
                                )
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      )
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="dark:bg-zinc-700" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CityInput;
