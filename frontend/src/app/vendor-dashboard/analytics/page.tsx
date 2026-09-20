"use client";

import React from "react";
import VendorHeader from "@/components/shared/Headers/VendorHeader";
import Footer from "@/components/shared/Footer";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { useQuery } from "@apollo/client";
import { GET_VENDOR_BY_ID, GET_VENDOR_ANALYTICS, GET_VENDOR_PAYMENTS, GET_VENDOR_MESSAGES } from "@/graphql/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FiTrendingUp, 
  FiEye, 
  FiMessageSquare, 
  FiDollarSign,
  FiUsers,
  FiStar 
} from "react-icons/fi";

const VendorAnalytics: React.FC = () => {
  const { vendor } = useVendorAuth();

  const {
    data: vendorData,
    loading: vendorLoading,
    error: vendorError,
  } = useQuery(GET_VENDOR_BY_ID, {
    variables: { id: vendor?.id },
    skip: !vendor?.id,
  });

  const {
    data: analyticsDataResult,
    loading: analyticsLoading,
    error: analyticsError,
  } = useQuery(GET_VENDOR_ANALYTICS, {
    variables: { vendorId: vendor?.id },
    skip: !vendor?.id,
  });

  const {
    data: paymentsData,
    loading: paymentsLoading,
    error: paymentsError,
  } = useQuery(GET_VENDOR_PAYMENTS, {
    variables: { vendorId: vendor?.id },
    skip: !vendor?.id,
  });

  const {
    data: chatsData,
    loading: chatsLoading,
    error: chatsError,
  } = useQuery(GET_VENDOR_MESSAGES, {
    variables: { vendorId: vendor?.id },
    skip: !vendor?.id,
  });

  if (vendorLoading || analyticsLoading || paymentsLoading || chatsLoading) {
    return (
      <div className="min-h-screen bg-lightYellow dark:bg-darkBg transition-colors duration-200 font-body">
        <VendorHeader />
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-darkSurface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-3"
              >
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (vendorError || analyticsError || paymentsError || chatsError) {
    return (
      <div className="min-h-screen bg-lightYellow dark:bg-darkBg transition-colors duration-200">
        <VendorHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600 dark:text-red-400">
            Error loading data: {vendorError?.message || analyticsError?.message || paymentsError?.message || chatsError?.message}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const vendorInfo = vendorData?.findVendorById;
  const analytics = analyticsDataResult?.getVendorAnalytics || {
    totalUniqueViews: 0,
    packagesAnalytics: [],
    monthlyViews: [],
  };

  // Get payment data
  const payments = paymentsData?.vendorPayments || [];
  
  // Calculate revenue from completed payments only
  const completedPayments = payments.filter((payment: any) => payment.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
  const totalBookings = completedPayments.length;

  // Get unique package count from payments
  const uniquePackageIds = new Set(completedPayments.map((payment: any) => payment.package?.id).filter(Boolean));
  const packagesWithBookings = uniquePackageIds.size;

  // Calculate revenue per package
  const packageRevenue = completedPayments.reduce((acc: any, payment: any) => {
    const packageId = payment.package?.id;
    if (packageId) {
      if (!acc[packageId]) {
        acc[packageId] = {
          packageName: payment.package.name,
          revenue: 0,
        };
      }
      acc[packageId].revenue += payment.amount;
    }
    return acc;
  }, {});

  // Calculate monthly revenue based on createdAt (payment date)
  const monthlyRevenue = completedPayments.reduce((acc: any, payment: any) => {
    if (payment.createdAt) {
      const date = new Date(payment.createdAt);
      // Format as "Feb" to match backend analytics format
      const monthAbbr = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!acc[monthAbbr]) {
        acc[monthAbbr] = 0;
      }
      acc[monthAbbr] += payment.amount;
    }
    return acc;
  }, {});

  // Total inquiries = number of unique chats (conversations)
  const totalInquiries = chatsData?.getVendorChats?.length ?? 0;

  return (
    <div className="min-h-screen bg-lightYellow dark:bg-darkBg transition-colors duration-200 flex flex-col">
      <VendorHeader />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-title text-gray-900 dark:text-zinc-100 mb-2">{vendorInfo?.busname || "Analytics Dashboard"}</h1>
          <p className="text-gray-600 dark:text-zinc-400 font-body text-sm">Track your business performance and insights</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Views Card - REAL DATA */}
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Total Views</h3>
            </div>
            <p className="text-3xl font-bold font-title text-gray-900 dark:text-zinc-100">{analytics.totalUniqueViews}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Unique people who viewed your packages
            </p>
          </div>

          {/* Total Inquiries Card */}
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Total Inquiries</h3>
            </div>
            <p className="text-3xl font-bold font-title text-gray-900 dark:text-zinc-100">{totalInquiries}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Active chat conversation{totalInquiries !== 1 ? "s" : ""} with couples
            </p>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Total Bookings</h3>
            </div>
            <p className="text-3xl font-bold font-title text-gray-900 dark:text-zinc-100">{totalBookings}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Completed bookings from {packagesWithBookings} package{packagesWithBookings !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold font-title text-gray-900 dark:text-zinc-100">LKR {totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              From {totalBookings} completed booking{totalBookings !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Average Rating Card */}
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Average Rating</h3>
            </div>
            <p className="text-3xl font-bold font-title text-gray-900 dark:text-zinc-100">4.8/5.0</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Based on 34 reviews
            </p>
          </div>

          {/* Packages Breakdown */}
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Total Packages</h3>
            </div>
            <p className="text-3xl font-bold font-title text-gray-900 dark:text-zinc-100">{analytics.packagesAnalytics.length}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Active service packages
            </p>
          </div>
        </div>

        {/* Package Analytics Table */}
        {analytics.packagesAnalytics.length > 0 && (
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold font-title text-gray-900 dark:text-zinc-100 mb-6">Package Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-zinc-700 text-xs uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                    <th className="text-left py-3 px-4 font-semibold">Package Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Unique Views</th>
                    <th className="text-left py-3 px-4 font-semibold">Revenue (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-sm">
                  {analytics.packagesAnalytics.map((pkg: any, index: number) => {
                    const revenue = packageRevenue[pkg.packageId]?.revenue || 0;
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-darkElevated/50 text-gray-800 dark:text-zinc-200 transition-colors">
                        <td className="py-3 px-4 font-medium">{pkg.packageName}</td>
                        <td className="py-3 px-4">{pkg.uniqueViews}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-zinc-100">{revenue.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Trends Cards */}
        {analytics.monthlyViews.length > 0 && (
          <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold font-title text-gray-900 dark:text-zinc-100 mb-6">Monthly View Trends</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {analytics.monthlyViews.map((data: any, index: number) => {
                const revenue = monthlyRevenue[data.month] || 0;
                return (
                  <div
                    key={index}
                    className="bg-lightYellow dark:bg-darkElevated rounded-xl p-4 flex flex-col gap-3 border border-orange/10 dark:border-zinc-700 hover:shadow-md transition-shadow"
                  >
                    <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                      {data.month}
                    </span>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FiEye className="text-blue-500 text-sm" />
                        <span className="text-xs text-gray-500 dark:text-zinc-400">Views</span>
                      </div>
                      <p className="text-2xl font-bold font-title text-gray-900 dark:text-zinc-100">{analytics.totalUniqueViews}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FiDollarSign className="text-orange text-sm" />
                        <span className="text-xs text-gray-500 dark:text-zinc-400">Revenue</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 dark:text-zinc-100">
                        LKR {revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
          <h2 className="text-2xl font-bold font-title text-gray-900 dark:text-zinc-100 mb-6">Performance Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-950/50 rounded-full p-2 mr-4 flex-shrink-0">
                <FiTrendingUp className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-zinc-100 text-sm">Unique Visitor Tracking</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-0.5">
                  You have {analytics.totalUniqueViews} unique visitor{analytics.totalUniqueViews !== 1 ? 's' : ''} across {analytics.packagesAnalytics.length} package{analytics.packagesAnalytics.length !== 1 ? 's' : ''}. 
                  {analytics.totalUniqueViews === 0 && " Visitors will be tracked automatically when they view your service pages."}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-950/50 rounded-full p-2 mr-4 flex-shrink-0">
                <FiDollarSign className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-zinc-100 text-sm">Revenue Performance</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-0.5">
                  Your total revenue is LKR {totalRevenue.toLocaleString()} from {totalBookings} completed booking{totalBookings !== 1 ? 's' : ''}. 
                  {totalRevenue === 0 && " Revenue will be tracked automatically when customers complete their payments."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorAnalytics;
