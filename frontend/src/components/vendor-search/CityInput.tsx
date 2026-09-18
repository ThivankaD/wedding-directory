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
import { Button } from "../ui/button";
import { CityProps } from "@/types/signupInput";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const CityInput: React.FC<CityProps> = ({ onCityChange }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
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
          <Button className="flex justify-between items-center w-full text-left px-2 py-0 text-gray-800 bg-transparent hover:bg-transparent transition duration-150 font-medium text-xs sm:text-sm h-7 shadow-none border-none">
            <span className="font-body font-medium truncate">
              {selectedCity || "Select City"}
            </span>
            <ChevronDown className="ml-1 h-3.5 w-3.5 text-gray-400 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg max-h-60 overflow-y-auto font-body z-10 border border-orange/15">
          <DropdownMenuLabel className="font-body px-4 py-2 text-gray-500">
            Find Your City
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {provinces.map((province, provinceIndex) => (
              <DropdownMenuSub key={provinceIndex}>
                <DropdownMenuSubTrigger className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer transition duration-150">
                  {province}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-white/90 rounded-lg shadow-lg backdrop-blur-sm max-h-60 overflow-y-auto">
                    {getDistrictsByProvince(province).map(
                      (district, districtIndex) => (
                        <DropdownMenuSub key={districtIndex}>
                          <DropdownMenuSubTrigger className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer transition duration-150">
                            {district}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-white/90 rounded-lg shadow-lg backdrop-blur-sm max-h-60 overflow-y-auto">
                              {getCitiesByDistrict(district).map(
                                (city, cityIndex) => (
                                  <DropdownMenuItem
                                    key={cityIndex}
                                    onClick={() => handleCitySelect(city)}
                                    className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer transition duration-150"
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
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CityInput;
