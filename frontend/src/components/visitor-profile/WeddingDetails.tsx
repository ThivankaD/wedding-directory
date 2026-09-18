"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@apollo/client";
import { GET_VISITOR_BY_ID } from "@/graphql/queries";
import { WeddingDetailsData } from "@/types/visitorProfileTypes";
import { useAuth } from "@/contexts/VisitorAuthContext";
import { UPDATE_VISITOR, SET_WEDDING_DATE } from "@/graphql/mutations";
import toast from "react-hot-toast";
import { FiCalendar, FiHeart, FiMapPin, FiUser } from "react-icons/fi";

const WeddingDetails: React.FC = () => {
  const { visitor } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_VISITOR_BY_ID, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
  });

  const [setWeddingDate] = useMutation(SET_WEDDING_DATE, {
    onCompleted: () => {
      toast.success("Wedding date updated and checklist generated!");
    },
    onError: (error) => {
      console.error("Error setting wedding date:", error);
      toast.error("Failed to update wedding date");
    },
  });

  const visitorData = data?.findVisitorById;

  const [weddingDetails, setWeddingDetails] = useState<WeddingDetailsData>({
    firstName: "",
    lastName: "",
    partnerFirstName: "",
    partnerLastName: "",
    engagementDate: "",
    weddingDate: "",
    weddingVenue: "",
  });

  useEffect(() => {
    if (visitorData) {
      setWeddingDetails({
        firstName: visitorData.visitor_fname || "",
        lastName: visitorData.visitor_lname || "",
        partnerFirstName: visitorData.partner_fname || "",
        partnerLastName: visitorData.partner_lname || "",
        engagementDate: visitorData.engaged_date
          ? visitorData.engaged_date.split("T")[0]
          : "",
        weddingDate: visitorData.wed_date
          ? visitorData.wed_date.split("T")[0]
          : "",
        weddingVenue: visitorData.wed_venue || "",
      });
    }
  }, [visitorData]);

  const [updateVisitor, { loading: isUpdating }] = useMutation(UPDATE_VISITOR, {
    onCompleted: () => {
      toast.success("Wedding details saved successfully!");
      refetch();
    },
    onError: (error) => {
      console.error("Error updating visitor:", error);
      toast.error("Error updating wedding details");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWeddingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateVisitor({
      variables: {
        id: visitor?.id,
        input: {
          visitor_fname: weddingDetails.firstName,
          visitor_lname: weddingDetails.lastName,
          partner_fname: weddingDetails.partnerFirstName,
          partner_lname: weddingDetails.partnerLastName,
          engaged_date: weddingDetails.engagementDate,
          wed_date: weddingDetails.weddingDate,
          wed_venue: weddingDetails.weddingVenue,
        },
      },
    });

    if (
      weddingDetails.weddingDate &&
      weddingDetails.weddingDate !== visitorData?.wed_date
    ) {
      try {
        await setWeddingDate({
          variables: {
            visitorId: visitor?.id,
            weddingDate: new Date(weddingDetails.weddingDate).toISOString(),
          },
        });
      } catch (err) {
        console.error("Error updating wedding date milestone:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-orange/20 p-8 flex items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-3 text-gray-500 font-body">
          <div className="w-5 h-5 border-2 border-orange border-t-transparent rounded-full animate-spin"></div>
          <span>Loading wedding details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-rose-200 p-8 text-center">
        <p className="text-rose-600 font-semibold font-body text-sm mb-1">
          Error loading profile details
        </p>
        <p className="text-gray-400 text-xs font-body">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange/20 p-6 sm:p-8">
      {/* Card Header matching Vendor Settings */}
      <div className="pb-6 mb-6 border-b border-orange/15">
        <h2 className="font-title text-2xl font-bold text-gray-900">
          Wedding Details
        </h2>
        <p className="text-gray-500 font-body text-sm mt-1">
          Update your couple information, ceremony dates, and venue location.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-body">
        {/* Section: Your Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiUser className="text-orange" size={16} />
            <h3 className="font-title font-bold text-base text-gray-900">
              Your Information
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-orange">*</span>
              </label>
              <Input
                name="firstName"
                value={weddingDetails.firstName}
                onChange={handleInputChange}
                placeholder="e.g. Vanuja"
                required
                className="h-11 rounded-xl border-orange/25 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-orange">*</span>
              </label>
              <Input
                name="lastName"
                value={weddingDetails.lastName}
                onChange={handleInputChange}
                placeholder="e.g. Karunaratne"
                required
                className="h-11 rounded-xl border-orange/25 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section: Partner Details */}
        <div className="pt-4 border-t border-orange/10">
          <div className="flex items-center gap-2 mb-3">
            <FiHeart className="text-orange" size={16} />
            <h3 className="font-title font-bold text-base text-gray-900">
              Partner&apos;s Information
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Partner&apos;s First Name
              </label>
              <Input
                name="partnerFirstName"
                value={weddingDetails.partnerFirstName}
                onChange={handleInputChange}
                placeholder="e.g. Hansika"
                className="h-11 rounded-xl border-orange/25 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Partner&apos;s Last Name
              </label>
              <Input
                name="partnerLastName"
                value={weddingDetails.partnerLastName}
                onChange={handleInputChange}
                placeholder="e.g. Perera"
                className="h-11 rounded-xl border-orange/25 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section: Dates & Venue */}
        <div className="pt-4 border-t border-orange/10">
          <div className="flex items-center gap-2 mb-3">
            <FiCalendar className="text-orange" size={16} />
            <h3 className="font-title font-bold text-base text-gray-900">
              Ceremony & Schedule
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Engagement Date
              </label>
              <Input
                type="date"
                name="engagementDate"
                value={weddingDetails.engagementDate}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-orange/25 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Wedding Date
              </label>
              <Input
                type="date"
                name="weddingDate"
                value={weddingDetails.weddingDate}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-orange/25 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <FiMapPin className="text-orange" size={14} />
              <span>Wedding Venue</span>
            </label>
            <Input
              name="weddingVenue"
              value={weddingDetails.weddingVenue}
              onChange={handleInputChange}
              placeholder="e.g. Cinnamon Grand Colombo, Lotus Ballroom"
              className="h-11 rounded-xl border-orange/25 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-orange/10 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 bg-orange hover:bg-orange/90 text-white font-semibold rounded-xl transition-all shadow-xs text-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isUpdating ? "Saving..." : "Save Wedding Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeddingDetails;