"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/types/vendorTypes";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { useMutation, useQuery } from "@apollo/client";
import { GET_VENDOR_BY_ID } from "@/graphql/queries";
import { UPDATE_VENDOR } from "@/graphql/mutations";
import toast from "react-hot-toast";
import VendorProfilePicture from "./VendorProfilePicture";
import { Skeleton } from "@/components/ui/skeleton";

const EditProfile: React.FC = () => {
  const { vendor } = useVendorAuth();
  const { data, loading, error, refetch } = useQuery(GET_VENDOR_BY_ID, {
    variables: { id: vendor?.id },
    skip: !vendor?.id,
  });

  const vendorData = data?.findVendorById;

  const [profile, setProfile] = useState<ProfileData>({
    firstName: vendorData?.fname || "",
    lastName: vendorData?.lname || "",
    phone: vendorData?.phone || "",
    profile_pic_url: vendorData?.profile_pic_url || "",
  });

  useEffect(() => {
    if (vendorData) {
      setProfile({
        firstName: vendorData.fname || "",
        lastName: vendorData.lname || "",
        phone: vendorData.phone || "",
        profile_pic_url: vendorData.profile_pic_url || "",
      });
    }
  }, [vendorData]);

  const [updateVendor, { loading: isUpdating }] = useMutation(UPDATE_VENDOR, {
    onCompleted: () => {
      toast.success("Profile information updated successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error("Error updating profile information");
      console.error("Error updating vendor:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor?.id) return;

    updateVendor({
      variables: {
        id: vendor.id,
        input: {
          fname: profile.firstName,
          lname: profile.lastName,
          phone: profile.phone,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 space-y-6 animate-fade-in">
        <div className="pb-6 border-b border-gray-100 dark:border-zinc-800 space-y-2">
          <Skeleton className="h-7 w-44 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-11 w-36 rounded-xl mt-4" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8">
      <div className="pb-6 mb-6 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="font-title text-2xl font-bold text-gray-900 dark:text-zinc-100">Personal Profile</h2>
        <p className="text-gray-500 dark:text-zinc-400 font-body text-sm mt-1">
          Your personal contact details and display picture.
        </p>
      </div>

      {vendor?.id && (
        <VendorProfilePicture
          vendorId={vendor.id}
          initialPic={vendorData?.profile_pic_url}
          onUploadSuccess={() => refetch()}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 font-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              First Name <span className="text-orange">*</span>
            </label>
            <Input
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              placeholder="Your first name"
              className="h-11 rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-darkElevated text-gray-900 dark:text-zinc-100 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              Last Name <span className="text-orange">*</span>
            </label>
            <Input
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              placeholder="Your last name"
              className="h-11 rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-darkElevated text-gray-900 dark:text-zinc-100 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
            Phone Number <span className="text-orange">*</span>
          </label>
          <Input
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            placeholder="e.g. +94 77 123 4567"
            className="h-11 rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-darkElevated text-gray-900 dark:text-zinc-100 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm"
            required
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-zinc-800">
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-orange hover:bg-orange/90 active:scale-[0.99] rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Profile Information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
