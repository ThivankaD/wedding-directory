'use client';

import { useLazyQuery } from '@apollo/client';
import React, { useState } from 'react'
import { Input } from '../ui/input';
import { LocationProps } from '@/types/signupInput';
import { AUTOCOMPLETE_QUERY } from '@/graphql/queries';

const LocationInput: React.FC<LocationProps> = ({ onLocationChange, disabled, placeholder, className }) => {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [autocomplete, { data, loading }] = useLazyQuery(AUTOCOMPLETE_QUERY);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      onLocationChange(value); // Allow free typing as address even without selecting dropdown item
      if (value.trim().length > 1) {
        setShowSuggestions(true);
        autocomplete({ variables: { input: value.trim() } });
      } else {
        setShowSuggestions(false);
      }
    };

    const handleSelect = (address: string) => {
      setInput(address);
      onLocationChange(address);
      setShowSuggestions(false);
    };

    return (
      <div className={className || "border-black border-solid border-2 rounded-lg flex flex-col relative bg-white dark:bg-darkElevated"}>
        <Input
          className="h-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3 text-sm bg-transparent dark:bg-transparent text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          type="text"
          value={input}
          onChange={handleChange}
          onFocus={() => {
            if (data?.autocompleteLocation && data.autocompleteLocation.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Slight delay so click on dropdown item registers before hiding
            setTimeout(() => setShowSuggestions(false), 250);
          }}
          placeholder={placeholder}
          disabled={disabled}
        />
        {showSuggestions && (
          <ul className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-darkElevated border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-700 font-body">
            {loading && (
              <li className="p-3 text-xs text-gray-400 dark:text-zinc-500 italic">Searching locations...</li>
            )}
            {data?.autocompleteLocation?.map((address: string, index: number) => (
              <li 
                key={index} 
                onMouseDown={() => handleSelect(address)} 
                className="p-3 text-xs text-gray-700 dark:text-zinc-200 hover:bg-orange/10 dark:hover:bg-darkSurface hover:text-orange dark:hover:text-orange cursor-pointer transition-colors"
              >
                {address}
              </li>
            ))}
            {!loading && (!data?.autocompleteLocation || data.autocompleteLocation.length === 0) && (
              <li className="p-3 text-xs text-gray-400 dark:text-zinc-500">
                No matching locations found. You can keep your typed address.
              </li>
            )}
          </ul>
        )}
      </div>
    );
};

export default LocationInput;
