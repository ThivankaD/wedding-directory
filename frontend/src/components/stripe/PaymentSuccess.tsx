"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import request from "@/utils/request";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCw,
  Printer,
  ArrowRight,
  Calendar,
  Building2,
  Tag,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";

interface PageProps {
  searchParams?: {
    order_id?: string | string[];
    session_id?: string | string[];
  };
  cancelOnLoad?: boolean;
}

function resolveParam(val: string | string[] | undefined | null): string {
  if (!val) return "";
  if (Array.isArray(val)) return val[0] || "";
  if (typeof val === "string" && val.includes(","))
    return val.split(",")[0].trim();
  return String(val).trim();
}

interface PayHerePaymentDetails {
  orderId: string;
  status: "pending" | "completed" | "failed";
  amount: number;
  gateway?: string;
  gatewayPaymentId?: string;
  customerEmail?: string;
  bookingDate?: string;
  vendorName?: string;
  packageName?: string;
  offeringName?: string;
  offeringId?: string;
  createdAt?: string;
}

export default function PaymentSuccess({
  searchParams,
  cancelOnLoad = false,
}: PageProps) {
  const urlSearchParams = useSearchParams();
  const allOrderIds = urlSearchParams.getAll("order_id");
  const allSessionIds = urlSearchParams.getAll("session_id");

  const orderId =
    resolveParam(searchParams?.order_id) ||
    resolveParam(searchParams?.session_id) ||
    allOrderIds[0] ||
    allSessionIds[0] ||
    urlSearchParams.get("order_id") ||
    urlSearchParams.get("session_id") ||
    "";

  const [payment, setPayment] = useState<PayHerePaymentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const confettiTriggered = useRef(false);

  const fetchPayment = useCallback(
    async (isRetry = false) => {
      if (!orderId) {
        setLoading(false);
        return null;
      }

      if (!isRetry) {
        setLoading(true);
      }
      setFetchError(null);

      try {
        const { data } = await request.get<PayHerePaymentDetails>(
          `/api/payhere/payment?order_id=${encodeURIComponent(orderId)}`,
        );
        setPayment(data);
        return data;
      } catch (err: unknown) {
        let msg = "Payment reference not found";
        if (err && typeof err === "object" && "response" in err) {
          const res = (err as { response?: { data?: { message?: string } } })
            .response;
          if (res?.data?.message) msg = res.data.message;
        }
        setFetchError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [orderId],
  );

  // Initial fetch
  useEffect(() => {
    const loadPayment = async () => {
      if (cancelOnLoad && orderId) {
        try {
          await request.post("/api/payhere/cancel", { order_id: orderId });
        } catch {
          // The status lookup below still gives the user the useful result.
        }
      }
      await fetchPayment();
    };

    loadPayment();
  }, [cancelOnLoad, fetchPayment, orderId]);

  // Confetti effect on completion
  useEffect(() => {
    if (payment?.status === "completed" && !confettiTriggered.current) {
      confettiTriggered.current = true;
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FC7B54", "#1F417F", "#10B981", "#F59E0B"],
        });
      } catch {
        // ignore if canvas-confetti fails in headless/test environments
      }
    }
  }, [payment?.status]);

  // Status polling if status is 'pending' (waiting for PayHere IPN notification)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (payment?.status === "pending" && pollCount < 10) {
      setIsPolling(true);
      timer = setTimeout(async () => {
        const updated = await fetchPayment(true);
        setPollCount((prev) => prev + 1);
        if (updated?.status !== "pending") {
          setIsPolling(false);
        }
      }, 2000);
    } else {
      setIsPolling(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [payment?.status, pollCount, fetchPayment]);

  // Auto-print if 'print=true' query param is present
  useEffect(() => {
    if (
      payment?.status === "completed" &&
      urlSearchParams.get("print") === "true"
    ) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [payment?.status, urlSearchParams]);

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!orderId) {
    return (
      <div className="py-16 px-4 flex justify-center">
        <div className="bg-white dark:bg-darkSurface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2 font-merriweather">
            Invalid Payment Reference
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 mb-6 text-sm">
            No valid order reference was detected in the URL. If you believe
            this is an error, please check your payments history.
          </p>
          <Link
            href="/visitor-dashboard/payments-history"
            className="inline-block w-full bg-orange text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all text-center"
          >
            Check Payment History
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !payment) {
    return (
      <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 border-4 border-orange/20 border-t-orange rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-200 font-merriweather mb-2">
          Verifying Payment with PayHere...
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm max-w-sm">
          Please wait a moment while we retrieve your transaction confirmation.
        </p>
      </div>
    );
  }

  if (fetchError && !payment) {
    return (
      <div className="py-16 px-4 flex justify-center">
        <div className="bg-white dark:bg-darkSurface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2 font-merriweather">
            Payment Not Found
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 mb-6 text-sm">
            {fetchError ||
              "We could not find records for this payment reference."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => fetchPayment()}
              className="w-full bg-orange text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <RotateCw size={16} /> Try Again
            </button>
            <Link
              href="/visitor-dashboard"
              className="inline-block w-full border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-darkElevated transition-all text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = payment?.status === "completed";
  const isFailed = payment?.status === "failed";
  const isPending = payment?.status === "pending";

  return (
    <>
      {/* ============================================================ */}
      {/* 1. ON-SCREEN INTERACTIVE VIEW (Hidden during print)          */}
      {/* ============================================================ */}
      <div className="w-full max-w-2xl mx-auto px-0 py-2 sm:py-4 print:hidden">
        <div className="bg-white dark:bg-darkSurface rounded-2xl sm:rounded-3xl shadow-[0_16px_45px_rgba(31,65,127,0.08)] dark:shadow-black/20 border border-orange/15 dark:border-zinc-800 overflow-hidden">
          {/* Status Header Banner */}
          <div
            className={`px-5 py-7 sm:px-8 sm:py-9 text-center ${
              isCompleted
                ? "bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/50 dark:to-darkSurface"
                : isFailed
                  ? "bg-gradient-to-b from-red-50 to-white dark:from-red-950/50 dark:to-darkSurface"
                  : "bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/50 dark:to-darkSurface"
            }`}
          >
            <div className="flex justify-center mb-4">
              {isCompleted && (
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/50 animate-in zoom-in-50 duration-300">
                  <CheckCircle2 size={44} strokeWidth={2.2} />
                </div>
              )}
              {isFailed && (
                <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200/50">
                  <AlertCircle size={44} strokeWidth={2.2} />
                </div>
              )}
              {isPending && (
                <div className="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-200/50">
                  <Clock
                    size={44}
                    strokeWidth={2.2}
                    className="animate-pulse"
                  />
                </div>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-100 font-merriweather mb-2 leading-tight">
              {isCompleted
                ? "Advance Payment Successful!"
                : isFailed
                  ? "Payment Unsuccessful"
                  : "Payment Being Processed"}
            </h1>

            <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
              {isCompleted &&
                "Thank you! Your advance booking has been confirmed and the vendor has been notified."}
              {isFailed &&
                "Your transaction could not be completed. Any funds held will be refunded according to your bank policies."}
              {isPending &&
                "Your payment was submitted to PayHere. We are waiting for confirmation from the payment gateway."}
            </p>

            {isPending && isPolling && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/70 text-amber-800 rounded-full text-xs font-medium">
                <RotateCw size={13} className="animate-spin" />
                Awaiting confirmation from PayHere (Attempt {pollCount + 1}
                /10)...
              </div>
            )}

            {isPending && !isPolling && pollCount >= 10 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-xl text-xs font-medium text-left max-w-md">
                <Clock size={16} className="shrink-0" />
                <span>
                  PayHere is still processing this transaction. The status will
                  automatically update in your dashboard as soon as the gateway
                  sends confirmation.
                </span>
              </div>
            )}
          </div>

          {/* Receipt / Details Section */}
          {payment && (
            <div className="p-4 sm:p-8 space-y-5 sm:space-y-6">
              <div className="bg-[#fffaf7] dark:bg-darkElevated rounded-2xl p-4 sm:p-5 border border-orange/10 dark:border-zinc-700">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-orange/10">
                  <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold">
                    Amount Paid
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-zinc-100 font-merriweather">
                    LKR{" "}
                    {Number(payment.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm min-w-0">
                  <div>
                    <span className="text-gray-500 dark:text-zinc-400 text-xs block mb-1">
                      Order Reference
                    </span>
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-gray-800 dark:text-zinc-200 bg-white dark:bg-darkSurface px-2.5 py-1.5 rounded-lg border border-orange/10 dark:border-zinc-700 min-w-0">
                      <span className="truncate min-w-0">
                        {payment.orderId}
                      </span>
                      <button
                        onClick={() => handleCopy(payment.orderId)}
                        title="Copy Order ID"
                        className="text-gray-400 hover:text-gray-700 transition"
                      >
                        {copied ? (
                          <Check size={14} className="text-emerald-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {payment.gatewayPaymentId && (
                    <div>
                      <span className="text-gray-500 dark:text-zinc-400 text-xs block mb-1">
                        PayHere Payment ID
                      </span>
                      <div className="font-mono text-xs font-semibold text-gray-800 dark:text-zinc-200 bg-white dark:bg-darkSurface px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700">
                        {payment.gatewayPaymentId}
                      </div>
                    </div>
                  )}

                  {payment.vendorName && (
                    <div className="flex items-start gap-2">
                      <Building2
                        size={16}
                        className="text-orange shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="text-gray-500 dark:text-zinc-400 text-xs block">
                          Vendor
                        </span>
                        <span className="font-medium text-gray-900 dark:text-zinc-100 break-words">
                          {payment.vendorName}
                        </span>
                      </div>
                    </div>
                  )}

                  {(payment.offeringName || payment.packageName) && (
                    <div className="flex items-start gap-2">
                      <Tag size={16} className="text-orange shrink-0 mt-0.5" />
                      <div>
                        <span className="text-gray-500 dark:text-zinc-400 text-xs block">
                          Service & Package
                        </span>
                        <span className="font-medium text-gray-900 dark:text-zinc-100 break-words">
                          {payment.offeringName
                            ? `${payment.offeringName} - `
                            : ""}
                          {payment.packageName || "Advance Payment"}
                        </span>
                      </div>
                    </div>
                  )}

                  {payment.bookingDate && (
                    <div className="flex items-start gap-2">
                      <Calendar
                        size={16}
                        className="text-orange shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="text-gray-500 dark:text-zinc-400 text-xs block">
                          Booked Wedding Date
                        </span>
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
                          {new Date(payment.bookingDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <ShieldCheck
                      size={16}
                      className="text-emerald-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="text-gray-500 dark:text-zinc-400 text-xs block">
                        Payment Status
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : isFailed
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions for Completed Payment */}
              {isCompleted && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/visitor-dashboard/payments-history"
                      className="w-full bg-orange text-white py-3.5 px-4 rounded-xl hover:opacity-90 transition-all font-medium text-sm flex items-center justify-center gap-2 text-center shadow-md shadow-orange/20"
                    >
                      View My Bookings <ArrowRight size={16} />
                    </Link>

                    <button
                      onClick={handlePrint}
                      className="w-full border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 py-3.5 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-darkElevated transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Printer size={16} /> Print Receipt
                    </button>
                  </div>

                  <Link
                    href="/services"
                    className="block text-center text-xs text-gray-500 hover:text-orange transition-colors pt-2"
                  >
                    Explore more wedding vendors &amp; services &rarr;
                  </Link>
                </div>
              )}

              {/* Actions for Pending State */}
              {isPending && (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setPollCount(0);
                      fetchPayment();
                    }}
                    className="w-full bg-orange text-white py-3.5 px-4 rounded-xl hover:opacity-90 transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-orange/20"
                  >
                    <RotateCw size={16} /> Refresh Payment Status
                  </button>
                  <Link
                    href="/visitor-dashboard"
                    className="block w-full border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 py-3.5 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-darkElevated transition-all font-medium text-sm text-center"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}

              {/* Actions for Failed State */}
              {isFailed && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {payment.offeringId ? (
                    <Link
                      href={`/services/${payment.offeringId}`}
                      className="w-full bg-orange text-white py-3.5 px-4 rounded-xl hover:opacity-90 transition-all font-medium text-sm flex items-center justify-center gap-2 text-center shadow-md shadow-orange/20"
                    >
                      Try Booking Again
                    </Link>
                  ) : (
                    <Link
                      href="/services"
                      className="w-full bg-orange text-white py-3.5 px-4 rounded-xl hover:opacity-90 transition-all font-medium text-sm flex items-center justify-center gap-2 text-center shadow-md shadow-orange/20"
                    >
                      Browse Services
                    </Link>
                  )}
                  <Link
                    href="/visitor-dashboard"
                    className="w-full border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 py-3.5 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-darkElevated transition-all font-medium text-sm flex items-center justify-center text-center"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. DEDICATED PRINT RECEIPT VIEW (Visible ONLY in print/PDF)  */}
      {/* ============================================================ */}
      {payment && (
        <div className="hidden print:block font-sans text-gray-900 bg-white p-6 max-w-2xl mx-auto border border-gray-300 rounded-2xl print-avoid-break">
          {/* Top Brand Header */}
          <div className="flex items-start justify-between pb-5 border-b-2 border-orange/80">
            <div>
              <h1 className="text-2xl font-bold font-merriweather text-gray-900 tracking-tight">
                Say I Do
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Sri Lanka&apos;s Wedding Directory &amp; Booking Platform
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                support@sayido.lk &bull; https://sayido.lk
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-orange/10 text-orange font-bold text-xs rounded-full uppercase tracking-wider mb-1">
                Official Receipt
              </span>
              <p className="text-xs text-gray-500">
                Date:{" "}
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
              </p>
              <p className="text-xs font-mono font-semibold text-gray-700 mt-0.5">
                Ref: {payment.orderId}
              </p>
            </div>
          </div>

          {/* Status & Amount Highlight Banner */}
          <div className="my-4 p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
                Payment Status
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : isFailed
                        ? "bg-red-100 text-red-800 border border-red-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {isCompleted ? "✓ Advance Payment Completed" : payment.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
                Amount Paid
              </span>
              <span className="text-2xl font-bold font-merriweather text-gray-900">
                LKR{" "}
                {Number(payment.amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Booking & Transaction Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs py-2">
            <div>
              <span className="text-gray-400 text-[11px] block font-medium">
                Vendor / Service Provider
              </span>
              <span className="font-semibold text-gray-900 text-sm">
                {payment.vendorName || "Wedding Vendor"}
              </span>
            </div>

            <div>
              <span className="text-gray-400 text-[11px] block font-medium">
                Service &amp; Package
              </span>
              <span className="font-semibold text-gray-900 text-sm">
                {payment.offeringName ? `${payment.offeringName} - ` : ""}
                {payment.packageName || "Advance Payment"}
              </span>
            </div>

            <div>
              <span className="text-gray-400 text-[11px] block font-medium">
                Booked Event Date
              </span>
              <span className="font-medium text-gray-800">
                {payment.bookingDate
                  ? new Date(payment.bookingDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "To be confirmed with vendor"}
              </span>
            </div>

            <div>
              <span className="text-gray-400 text-[11px] block font-medium">
                Payment Gateway
              </span>
              <span className="font-medium text-gray-800 capitalize">
                {payment.gateway || "PayHere"} (Secure Online Payment)
              </span>
            </div>

            <div>
              <span className="text-gray-400 text-[11px] block font-medium">
                Order Reference
              </span>
              <span className="font-mono text-xs font-semibold text-gray-800">
                {payment.orderId}
              </span>
            </div>

            {payment.gatewayPaymentId && (
              <div>
                <span className="text-gray-400 text-[11px] block font-medium">
                  PayHere Payment ID
                </span>
                <span className="font-mono text-xs font-semibold text-gray-800">
                  {payment.gatewayPaymentId}
                </span>
              </div>
            )}

            {payment.customerEmail && (
              <div>
                <span className="text-gray-400 text-[11px] block font-medium">
                  Customer Email
                </span>
                <span className="text-xs text-gray-800">
                  {payment.customerEmail}
                </span>
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-gray-800">
                      {payment.offeringName || "Wedding Service"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Package: {payment.packageName || "Standard"} &bull; Event
                      Date:{" "}
                      {payment.bookingDate
                        ? new Date(payment.bookingDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "Confirmed"}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-600">
                    Advance Deposit (20%)
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-900">
                    {Number(payment.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50/90 border-t border-gray-200 font-semibold text-xs">
                <tr>
                  <td
                    colSpan={2}
                    className="py-2.5 px-3 text-right text-gray-600"
                  >
                    Total Advance Paid:
                  </td>
                  <td className="py-2.5 px-3 text-right text-sm text-gray-900 font-bold">
                    LKR{" "}
                    {Number(payment.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Confirmation & Terms Note */}
          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[11px] text-amber-900 space-y-1">
            <p className="font-semibold">Booking Confirmation Notice:</p>
            <p className="text-amber-800 leading-relaxed">
              This receipt confirms your advance booking deposit. Your vendor
              has been notified and will coordinate wedding day arrangements
              directly with you. The remaining balance is payable according to
              the vendor&apos;s agreed schedule.
            </p>
          </div>

          {/* Receipt Footer */}
          <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
            <span>
              Say I Do &copy; {new Date().getFullYear()} &bull; All Rights
              Reserved
            </span>
            <span>
              Computer-generated electronic receipt &bull; No signature required
            </span>
          </div>
        </div>
      )}
    </>
  );
}
