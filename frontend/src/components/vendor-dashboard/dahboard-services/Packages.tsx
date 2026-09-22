"use client";
import React from "react";
import { Check } from "lucide-react";
import { useQuery } from "@apollo/client";
import { FIND_PACKAGES_BY_OFFERING } from "@/graphql/queries";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Package {
  id: string;
  name: string;
  description: string;
  pricing: number;
  features: string[];
  image?: string | null;
}

interface PackageDetailsProps {
  name: string;
  description: string;
  pricing: number;
  features: string[];
  image?: string | null;
}

const Packages = () => {
  const params = useParams();
  const offeringId = params.id as string;

  const { loading, error, data } = useQuery(FIND_PACKAGES_BY_OFFERING, {
    variables: { serviceId: offeringId },
  });

  const PackageDetails: React.FC<PackageDetailsProps> = ({
    name,
    description,
    pricing,
    features,
    image,
  }) => (
    <div className="space-y-6 bg-white dark:bg-darkSurface border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-md flex flex-col justify-between">
      <div>
        {image && (
          <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-darkElevated">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
        )}
        <h2 className="text-2xl font-bold font-title mb-2 text-gray-900 dark:text-zinc-100">
          {name}
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 font-body text-sm mb-4 leading-relaxed">
          {description}
        </p>
        <div className="mb-6">
          <span className="text-3xl font-bold font-title text-gray-900 dark:text-zinc-100">
            {pricing.toLocaleString()}
          </span>
          <span className="text-gray-500 dark:text-zinc-400 font-body text-sm ml-1 font-semibold">
            LKR
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold font-title mb-3 text-gray-900 dark:text-zinc-200">
          Features:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-zinc-300 font-body">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const packagesList = data?.findPackagesByService || [];

  if (loading)
    return (
      <div className="p-4 text-gray-500 dark:text-zinc-400 text-sm">
        Loading packages...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-red-500 text-sm">
        Error loading packages: {error.message}
      </div>
    );
  if (!packagesList.length)
    return (
      <div className="p-4 text-gray-500 dark:text-zinc-400 text-sm">
        No packages available
      </div>
    );

  return (
    <div className="w-full max-w-7xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packagesList.map((pkg: Package) => (
          <PackageDetails
            key={pkg.id}
            name={pkg.name}
            description={pkg.description}
            pricing={pkg.pricing}
            features={pkg.features}
            image={pkg.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Packages;
