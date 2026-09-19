"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/VisitorAuthContext";
import { useMutation, useQuery } from "@apollo/client";
import { GET_VISITOR_BY_ID } from "@/graphql/queries";
import { UPDATE_VISITOR } from "@/graphql/mutations";
import { AccountDetailsData } from "@/types/visitorProfileTypes";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const AccountDetails: React.FC = () => {
  const { visitor } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_VISITOR_BY_ID, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
  });

  const visitorData = data?.findVisitorById;

  const [accountDetails, setAccountDetails] = useState<AccountDetailsData>({
    email: "",
    password: "",
    retypePassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  useEffect(() => {
    if (visitorData?.email) {
      setAccountDetails((prev) => ({
        ...prev,
        email: visitorData.email,
      }));
    }
  }, [visitorData]);

  const [updateVisitor, { loading: isUpdating }] = useMutation(UPDATE_VISITOR, {
    onCompleted: () => {
      toast.success("Account details updated successfully!");
      setAccountDetails((prev) => ({
        ...prev,
        password: "",
        retypePassword: "",
      }));
      refetch();
    },
    onError: (error) => {
      console.error("Error updating visitor account:", error);
      toast.error(error.message || "Account details update failed!");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (accountDetails.password || accountDetails.retypePassword) {
      if (accountDetails.password !== accountDetails.retypePassword) {
        toast.error("Passwords do not match.");
        return;
      }

      if (accountDetails.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
    }

    const input: { email: string; password?: string } = {
      email: accountDetails.email,
    };

    if (accountDetails.password) {
      input.password = accountDetails.password;
    }

    updateVisitor({
      variables: {
        id: visitor?.id,
        input,
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-orange/20 p-8 flex items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-3 text-gray-500 dark:text-zinc-400 font-body">
          <div className="w-5 h-5 border-2 border-orange border-t-transparent rounded-full animate-spin"></div>
          <span>Loading account details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-rose-200 dark:border-rose-900/50 p-8 text-center">
        <p className="text-rose-600 dark:text-rose-400 font-semibold font-body text-sm mb-1">
          Error loading account details
        </p>
        <p className="text-gray-400 dark:text-zinc-500 text-xs font-body">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-orange/20 p-6 sm:p-8">
      {/* Card Header matching Vendor Settings */}
      <div className="pb-6 mb-6 border-b border-orange/15 dark:border-zinc-800">
        <h2 className="font-title text-2xl font-bold text-gray-900 dark:text-zinc-100">
          Account Security
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 font-body text-sm mt-1">
          Manage your login email and security credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-body">
        {/* Email Address Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
            Email Address
          </label>
          <div className="relative max-w-lg">
            <Input
              type="email"
              name="email"
              value={accountDetails.email}
              onChange={handleInputChange}
              required
              className="h-11 rounded-xl border-orange/25 dark:border-zinc-700 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white dark:bg-darkElevated dark:text-zinc-100 dark:placeholder:text-zinc-500 pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
              <FiMail size={16} />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5 font-body">
            Used for signing in, notifications, and booking confirmation updates.
          </p>
        </div>

        {/* Change Password Section */}
        <div className="pt-4 border-t border-orange/10 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <FiLock className="text-orange" size={16} />
            <h3 className="font-title font-bold text-base text-gray-900 dark:text-zinc-100">
              Change Password
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4 font-body">
            Leave blank if you do not wish to change your password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={accountDetails.password}
                  onChange={handleInputChange}
                  placeholder="Min. 6 characters"
                  className="h-11 rounded-xl border-orange/25 dark:border-zinc-700 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white dark:bg-darkElevated dark:text-zinc-100 dark:placeholder:text-zinc-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showRetypePassword ? "text" : "password"}
                  name="retypePassword"
                  value={accountDetails.retypePassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter new password"
                  className="h-11 rounded-xl border-orange/25 dark:border-zinc-700 focus:border-orange focus:ring-2 focus:ring-orange/20 text-sm font-body bg-white dark:bg-darkElevated dark:text-zinc-100 dark:placeholder:text-zinc-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                  title={showRetypePassword ? "Hide password" : "Show password"}
                >
                  {showRetypePassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-orange/10 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 bg-orange hover:bg-orange/90 text-white font-semibold rounded-xl transition-all shadow-xs text-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isUpdating ? "Saving..." : "Save Account Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;