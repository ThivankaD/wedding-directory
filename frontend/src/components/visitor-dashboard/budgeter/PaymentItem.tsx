import React from "react";
import { PaymentData } from "@/types/budgeterTypes";
import { FiCalendar, FiCheckCircle } from "react-icons/fi";

interface PaymentItemProps {
  payment: PaymentData;
}

const PaymentItem: React.FC<PaymentItemProps> = ({ payment }) => {
  const paymentDate = new Date(payment.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
  const packagePrice = payment.package?.pricing || 0;
  const amountPaid = payment.amount || 0;

  return (
    <div className="w-full bg-white dark:bg-darkSurface rounded-2xl border-2 border-orange/20 dark:border-zinc-800 hover:border-orange/50 dark:hover:border-orange/50 shadow-2xs hover:shadow-xs transition-all p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Service & Package Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-title text-base sm:text-lg font-bold text-gray-900 dark:text-zinc-100 truncate">
            {payment.package?.service?.name || "Wedding Service"}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange bg-orange/10 px-2.5 py-0.5 rounded-full">
              Package: {payment.package?.name || "Standard"}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400">
              <FiCalendar className="text-orange shrink-0" size={13} />
              <span>{paymentDate}</span>
            </span>
          </div>
        </div>

        {/* Middle: Financials */}
        <div className="flex items-center gap-6 sm:gap-10 shrink-0">
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
              Package Price
            </p>
            <p className="font-title text-base sm:text-lg font-bold text-gray-800 dark:text-zinc-200">
              {packagePrice.toLocaleString()}{" "}
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                LKR
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Amount Paid
            </p>
            <p className="font-title text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {amountPaid.toLocaleString()}{" "}
              <span className="text-xs font-semibold text-emerald-600/80 dark:text-emerald-400/80">
                LKR
              </span>
            </p>
          </div>
        </div>

        {/* Right: Completed Status Badge */}
        <div className="flex items-center md:justify-end shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
            <FiCheckCircle
              size={13}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <span>Completed</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentItem;
