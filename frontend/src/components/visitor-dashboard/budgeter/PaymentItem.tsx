import React from 'react';
import { PaymentData } from '@/types/budgeterTypes';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';

interface PaymentItemProps {
  payment: PaymentData;
}

const PaymentItem: React.FC<PaymentItemProps> = ({ payment }) => {
  const paymentDate = new Date(payment.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const packagePrice = payment.package?.pricing || 0;
  const amountPaid = payment.amount || 0;

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-orange/20 hover:border-orange/50 shadow-2xs hover:shadow-xs transition-all p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Service & Package Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-title text-base sm:text-lg font-bold text-gray-900 truncate">
            {payment.package?.offering?.name || "Wedding Service"}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange bg-orange/10 px-2.5 py-0.5 rounded-full">
              Package: {payment.package?.name || "Standard"}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiCalendar className="text-orange shrink-0" size={13} />
              <span>{paymentDate}</span>
            </span>
          </div>
        </div>

        {/* Middle: Financials */}
        <div className="flex items-center gap-6 sm:gap-10 shrink-0">
          <div>
            <p className="text-xs text-gray-500 font-medium">Package Price</p>
            <p className="font-title text-base sm:text-lg font-bold text-gray-800">
              {packagePrice.toLocaleString()} <span className="text-xs font-semibold text-gray-500">LKR</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-emerald-600 font-medium">Amount Paid</p>
            <p className="font-title text-base sm:text-lg font-bold text-emerald-600">
              {amountPaid.toLocaleString()} <span className="text-xs font-semibold text-emerald-600/80">LKR</span>
            </p>
          </div>
        </div>

        {/* Right: Completed Status Badge */}
        <div className="flex items-center md:justify-end shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <FiCheckCircle size={13} className="text-emerald-600" />
            <span>Completed</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentItem;