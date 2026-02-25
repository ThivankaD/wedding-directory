"use client";

import React from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { useQuery } from "@apollo/client";
import { GET_VENDOR_BY_ID, GET_VENDOR_ANALYTICS, GET_VENDOR_PAYMENTS } from "@/graphql/queries";
import LoaderJelly from "@/components/shared/Loaders/LoaderJelly";
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

  if (vendorLoading || analyticsLoading || paymentsLoading) {
    return (
      <div className="min-h-screen bg-lightYellow">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoaderJelly />
        </div>
        <Footer />
      </div>
    );
  }

  if (vendorError || analyticsError || paymentsError) {
    return (
      <div className="min-h-screen bg-lightYellow">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">
            Error loading data: {vendorError?.message || analyticsError?.message || paymentsError?.message}
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

  // Sample placeholder data for features not yet implemented
  const placeholderData = {
    totalInquiries: 56,
  };

  return (
    <div className="min-h-screen bg-lightYellow">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">{vendorInfo?.busname || "Analytics Dashboard"}</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Views Card - REAL DATA */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total  Views</h3>
              <FiEye className="text-3xl text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-text">{analytics.totalUniqueViews}</p>
            <p className="text-sm text-gray-500 mt-2">
              Unique people who viewed your packages
            </p>
          </div>

          {/* Total Inquiries Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Inquiries</h3>
              <FiMessageSquare className="text-3xl text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-text">{placeholderData.totalInquiries}</p>
            <p className="text-sm text-gray-500 mt-2">
              Coming soon - chat integration
            </p>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
              <FiUsers className="text-3xl text-green-500" />
            </div>
            <p className="text-3xl font-bold text-text">{totalBookings}</p>
            <p className="text-sm text-gray-500 mt-2">
              Completed bookings from {packagesWithBookings} package{packagesWithBookings !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <FiDollarSign className="text-3xl text-orange" />
            </div>
            <p className="text-3xl font-bold text-text">LKR {totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">
              From {totalBookings} completed booking{totalBookings !== 1 ? 's' : ''}
            </p>
          </div>



          {/* Average Rating Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Average Rating</h3>
              <FiStar className="text-3xl text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-text">4.8/5.0</p>
            <p className="text-sm text-gray-600 mt-2">
              Based on 34 reviews
            </p>
          </div>

          {/* Packages Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Packages</h3>
              <FiTrendingUp className="text-3xl text-teal-500" />
            </div>
            <p className="text-3xl font-bold text-text">{analytics.packagesAnalytics.length}</p>
            <p className="text-sm text-gray-600 mt-2">
              Active service packages
            </p>
          </div>
        </div>

        {/* Package Analytics Table */}
        {analytics.packagesAnalytics.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Package Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Package Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Unique Views</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.packagesAnalytics.map((pkg: any, index: number) => {
                    const revenue = packageRevenue[pkg.packageId]?.revenue || 0;
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{pkg.packageName}</td>
                        <td className="py-3 px-4">{pkg.uniqueViews}</td>
                        <td className="py-3 px-4">{revenue.toLocaleString()}</td>
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Monthly View Trends</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {analytics.monthlyViews.map((data: any, index: number) => {
                const revenue = monthlyRevenue[data.month] || 0;
                return (
                  <div
                    key={index}
                    className="bg-lightYellow rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {data.month}
                    </span>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FiEye className="text-blue-500 text-sm" />
                        <span className="text-xs text-gray-500">Views</span>
                      </div>
                      <p className="text-3xl font-bold text-text">{analytics.totalUniqueViews}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FiDollarSign className="text-orange text-sm" />
                        <span className="text-xs text-gray-500">Revenue</span>
                      </div>
                      <p className="text-sm font-bold text-text">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Performance Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Unique Visitor Tracking</h4>
                <p className="text-gray-600">
                  You have {analytics.totalUniqueViews} unique visitor{analytics.totalUniqueViews !== 1 ? 's' : ''} across {analytics.packagesAnalytics.length} package{analytics.packagesAnalytics.length !== 1 ? 's' : ''}. 
                  {analytics.totalUniqueViews === 0 && " Visitors will be tracked automatically when they view your service pages."}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <FiDollarSign className="text-blue-600 text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Revenue Performance</h4>
                <p className="text-gray-600">
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
