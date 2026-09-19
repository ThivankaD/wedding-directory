import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

const BudgetHeader = ({ budget = 0.00, totalCost = 0.00 }) => {
  const utilizationPercentage = budget > 0 ? ((totalCost / budget) * 100).toFixed(1) : "0.0";

  const breadcrumbItems = [
    { label: "Dashboard", href: "/visitor-dashboard" },
    { label: "Budgeter" },
  ];

  return (
    <div className="bg-white dark:bg-darkSurface rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-8 relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="mb-3">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <h1 className="font-title text-3xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
            My Budgeting Tool
          </h1>
          <p className="font-body text-gray-600 dark:text-zinc-400 text-sm sm:text-base mt-1.5 max-w-xl">
            Plan your wedding expenses effectively, track payments, and stay comfortably within budget.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end bg-orange/[0.05] dark:bg-orange/[0.08] border-2 border-orange/20 rounded-2xl p-4 sm:p-5 shrink-0 min-w-[200px]">
          <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Budget Utilized</p>
          <p className="font-title text-3xl sm:text-4xl font-bold text-orange my-0.5">{utilizationPercentage}%</p>
          <p className="font-body text-xs text-gray-500 dark:text-zinc-400">of your total budget</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;
