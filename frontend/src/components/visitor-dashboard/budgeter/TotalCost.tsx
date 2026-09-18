import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { TotalCostProps, UtilizationPercentage } from '@/types/budgeterTypes';

ChartJS.register(ArcElement, Tooltip, Legend);

const TotalCost: React.FC<TotalCostProps> = ({ totalCost = 0.00, budget = 0.00 })  => {
  const rawPercentage = budget > 0 ? (totalCost / budget) * 100 : 0;
  const utilizationPercentage: UtilizationPercentage = rawPercentage.toFixed(0);

  const data = {
    datasets: [
      {
        data: [Number(utilizationPercentage), Math.max(0, 100 - Number(utilizationPercentage))],
        backgroundColor: ['#FC7B54', '#FFEFEB'],
        borderWidth: 0,
        circumference: 360,
        rotation: -90,
      },
    ],
  };

  const options = {
    cutout: '82%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-orange/20 hover:border-orange shadow-xs hover:shadow-md transition-all p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
      <div className="relative h-32 w-32 shrink-0">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-title text-2xl sm:text-3xl font-bold text-orange">
            {utilizationPercentage}%
          </span>
        </div>
      </div>
      <div className="text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-orange">Estimated</span>
        <h2 className="font-title text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 mb-1">Total Cost</h2>
        <p className="font-title text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {totalCost.toLocaleString()} <span className="text-sm font-semibold text-gray-500">LKR</span>
        </p>
        <div className="text-xs text-gray-500 font-body bg-orange/[0.04] border border-orange/15 rounded-xl px-3 py-1.5 inline-block">
          <span>Target Budget: </span>
          <strong className="text-gray-800 font-bold">{budget.toLocaleString()} LKR</strong>
        </div>
      </div>
    </div>
  );
};

export default TotalCost;