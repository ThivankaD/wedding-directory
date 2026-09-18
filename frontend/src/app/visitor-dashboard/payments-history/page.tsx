"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/contexts/VisitorAuthContext";
import LoaderHelix from "@/components/shared/Loaders/LoaderHelix";
import { useQuery } from '@apollo/client';
import { GET_VISITOR_PAYMENTS } from '@/graphql/queries';
import BottomNavigationBar from '@/components/visitor-dashboard/BottomNavigationBar';
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiSearch,
  FiPrinter,
  FiExternalLink,
  FiFileText,
  FiX,
  FiShoppingBag,
} from 'react-icons/fi';

interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | string;
  createdAt: string;
  bookingDate?: string;
  paymentReference?: string;
  gateway?: string;
  gatewayPaymentId?: string;
  vendor?: {
    id?: string;
    busname?: string;
    fname?: string;
    lname?: string;
    city?: string;
  };
  package?: {
    id?: string;
    name: string;
    offering?: {
      id: string;
      name: string;
      category?: string;
      banner?: string;
    };
  };
}

const PaymentsHistoryPage = () => {
  const { visitor } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { data, loading, error } = useQuery(GET_VISITOR_PAYMENTS, {
    variables: { visitorId: visitor?.id },
    skip: !visitor?.id,
    fetchPolicy: 'cache-and-network',
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle size={12} className="text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <FiClock size={12} className="text-amber-600" />
            <span>Pending</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <FiAlertCircle size={12} className="text-rose-600" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <span>{status || 'Unknown'}</span>
          </span>
        );
    }
  };

  const handlePrint = (paymentReference?: string | null) => {
    if (typeof window !== 'undefined') {
      if (paymentReference) {
        window.open(`/success?order_id=${encodeURIComponent(paymentReference)}&print=true`, '_blank');
      } else {
        window.print();
      }
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <LoaderHelix />
        <p className="text-sm font-semibold text-gray-600 font-body">Loading your payments history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border-2 border-orange/20 max-w-lg mx-auto mt-12">
        <p className="text-red-500 font-semibold mb-2 font-title text-lg">Error loading payments</p>
        <p className="text-xs text-gray-500 font-body">{error.message}</p>
      </div>
    );
  }

  const payments: Payment[] = data?.visitorPayments || [];

  // Financial and counts calculation
  const completedPayments = payments.filter(
    (p) => p.status?.toLowerCase() === 'completed'
  );
  const totalPaid = completedPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );
  const pendingCount = payments.filter(
    (p) => p.status?.toLowerCase() === 'pending'
  ).length;
  const failedCount = payments.filter(
    (p) => p.status?.toLowerCase() === 'failed'
  ).length;

  // Search and status filtering
  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase().trim();
    const serviceName = (payment.package?.offering?.name || '').toLowerCase();
    const vendorName = (payment.vendor?.busname || '').toLowerCase();
    const packageName = (payment.package?.name || '').toLowerCase();
    const refId = (payment.paymentReference || payment.id || '').toLowerCase();

    const matchesSearch =
      query === "" ||
      serviceName.includes(query) ||
      vendorName.includes(query) ||
      packageName.includes(query) ||
      refId.includes(query);

    const matchesStatus =
      filterStatus === "" || payment.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6">
      {/* 1. Hero Card */}
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/visitor-dashboard" },
              { label: "Payments History", href: "/visitor-dashboard/payments-history" },
            ]}
          />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <FiCreditCard size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title text-gray-900">
                Payments History
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-body">
                Track all your wedding service payments, invoices, and transaction records.
              </p>
            </div>
          </div>
        </div>

        {/* Total Paid Badge Card */}
        <div className="bg-orange/[0.05] border-2 border-orange/15 rounded-2xl p-5 flex items-center gap-6 shrink-0 justify-between lg:justify-end">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-body">
              Total Amount Paid
            </p>
            <p className="text-2xl sm:text-3xl font-black font-title text-orange">
              {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
              <span className="text-xs font-bold text-gray-500">LKR</span>
            </p>
          </div>
          <div className="h-10 w-px bg-orange/20" />
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-body">
              Total Transactions
            </p>
            <p className="text-2xl sm:text-3xl font-black font-title text-gray-900">
              {payments.length}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Metrics Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider font-body">
            <FiCreditCard className="text-orange" size={14} />
            <span>Total Payments</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-gray-900 mt-2">
            {payments.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider font-body">
            <FiCheckCircle className="text-emerald-600" size={14} />
            <span>Completed</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-emerald-600 mt-2">
            {completedPayments.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider font-body">
            <FiClock className="text-amber-600" size={14} />
            <span>Pending</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-amber-600 mt-2">
            {pendingCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider font-body">
            <FiAlertCircle className="text-rose-600" size={14} />
            <span>Failed</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-rose-600 mt-2">
            {failedCount}
          </p>
        </div>
      </div>

      {/* 3. Main Payments Table Card */}
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-orange/15">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by service, vendor, package, or reference..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-orange/[0.02] border-2 border-orange/20 focus:border-orange rounded-xl focus:outline-none focus:ring-1 focus:ring-orange text-gray-800 placeholder-gray-400 transition-all font-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-body whitespace-nowrap">
              Status:
            </span>
            <select
              className="border-2 border-orange/20 focus:border-orange rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white text-gray-800 font-semibold focus:outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {filteredPayments.length === 0 ? (
          <div className="border-2 border-dashed border-orange/20 rounded-3xl p-10 sm:p-14 text-center space-y-4 bg-orange/[0.02]">
            <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center text-orange mx-auto">
              <FiCreditCard size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold font-title text-gray-800">
                {payments.length === 0 ? "No payment records found" : "No matching payments found"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-body max-w-sm mx-auto">
                {payments.length === 0
                  ? "When you book wedding vendor packages, your payment receipts and invoice history will appear here."
                  : "Try adjusting your search keyword or clearing the status filter."}
              </p>
            </div>
          </div>
        ) : (
          <div className="border-2 border-orange/15 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-body">
                <thead className="bg-orange/[0.06] text-gray-900 font-bold uppercase tracking-wider text-xs border-b border-orange/15 font-title">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Service & Vendor</th>
                    <th className="py-3.5 px-4">Package</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange/10 bg-white">
                  {filteredPayments.map((payment, idx) => {
                    const serviceName = payment.package?.offering?.name || 'Wedding Service';
                    const offeringId = payment.package?.offering?.id;
                    const vendorBusname = payment.vendor?.busname;
                    const paymentDate = new Date(payment.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr
                        key={payment.id}
                        className="hover:bg-orange/[0.02] transition-colors"
                      >
                        {/* Index */}
                        <td className="py-3.5 px-4 text-center text-xs font-semibold text-gray-400">
                          {idx + 1}
                        </td>

                        {/* Service & Vendor */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange/10 text-orange font-bold font-title flex items-center justify-center shrink-0 text-xs">
                              <FiShoppingBag size={14} />
                            </div>
                            <div>
                              {offeringId ? (
                                <Link
                                  href={`/services/${offeringId}`}
                                  className="font-bold text-gray-900 hover:text-orange transition-colors font-title text-sm inline-flex items-center gap-1 group"
                                >
                                  <span>{serviceName}</span>
                                  <FiExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              ) : (
                                <p className="font-bold text-gray-900 font-title text-sm">
                                  {serviceName}
                                </p>
                              )}
                              {vendorBusname && (
                                <p className="text-[11px] text-gray-500 line-clamp-1">
                                  {vendorBusname}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Package */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/15">
                            {payment.package?.name || 'Standard'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-gray-900 font-title text-sm">
                            {Number(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                            <span className="text-xs font-semibold text-gray-500">LKR</span>
                          </p>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-gray-600">
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <FiCalendar className="text-orange shrink-0" size={13} />
                            <span>{paymentDate}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          {getStatusBadge(payment.status)}
                        </td>

                        {/* Action: Receipt */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedReceipt(payment)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange hover:bg-orange hover:text-white bg-orange/10 rounded-xl transition-all cursor-pointer shadow-2xs"
                          >
                            <FiFileText size={13} />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Themed Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-7 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-orange/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                  <FiFileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 font-title text-lg sm:text-xl">
                    Payment Receipt
                  </h3>
                  <p className="text-xs text-gray-500 font-body">Transaction details and receipt</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-orange/10 hover:text-orange flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm font-body">
              <div className="flex justify-between py-2 border-b border-orange/10">
                <span className="text-gray-500 font-medium">Service</span>
                <span className="font-bold text-gray-900 text-right">
                  {selectedReceipt.package?.offering?.name || 'Wedding Service'}
                </span>
              </div>

              {selectedReceipt.vendor?.busname && (
                <div className="flex justify-between py-2 border-b border-orange/10">
                  <span className="text-gray-500 font-medium">Vendor</span>
                  <span className="font-semibold text-gray-800 text-right">
                    {selectedReceipt.vendor.busname}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-2 border-b border-orange/10">
                <span className="text-gray-500 font-medium">Package</span>
                <span className="text-gray-800 font-semibold text-right">
                  {selectedReceipt.package?.name || 'Standard'}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-orange/10">
                <span className="text-gray-500 font-medium">Amount</span>
                <span className="font-black text-gray-900 font-title text-base text-right">
                  {Number(selectedReceipt.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                  <span className="text-xs font-semibold text-gray-500">LKR</span>
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-orange/10">
                <span className="text-gray-500 font-medium">Reference</span>
                <span className="font-mono text-xs font-semibold text-gray-700 text-right break-all">
                  {selectedReceipt.paymentReference || selectedReceipt.id}
                </span>
              </div>

              {selectedReceipt.gatewayPaymentId && (
                <div className="flex justify-between py-2 border-b border-orange/10">
                  <span className="text-gray-500 font-medium">Gateway Payment ID</span>
                  <span className="font-mono text-xs font-semibold text-gray-700 text-right break-all">
                    {selectedReceipt.gatewayPaymentId}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-2 border-b border-orange/10">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="text-gray-800 font-semibold text-right">
                  {new Date(selectedReceipt.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 font-medium">Status</span>
                <span>{getStatusBadge(selectedReceipt.status)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-orange/15 flex gap-3">
              <button
                onClick={() => handlePrint(selectedReceipt.paymentReference)}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <FiPrinter size={15} />
                <span>Print</span>
              </button>

              {selectedReceipt.paymentReference && (
                <Link
                  href={`/success?order_id=${selectedReceipt.paymentReference}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-orange hover:bg-orange/90 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center shadow-xs cursor-pointer"
                >
                  <span>View Details</span>
                  <FiExternalLink size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavigationBar />
    </div>
  );
};

export default PaymentsHistoryPage;