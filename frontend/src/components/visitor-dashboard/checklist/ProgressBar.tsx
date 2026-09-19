import React from "react";
import { ProgressBarProps } from "@/types/taskTypes";

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs sm:text-sm font-body">
        <span className="font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider text-xs">Overall Progress</span>
        <span className="font-bold text-orange font-title text-base sm:text-lg">{progress}% Complete</span>
      </div>
      <div className="w-full bg-orange/10 dark:bg-zinc-800 rounded-full h-3 overflow-hidden p-0.5 border border-orange/20 dark:border-zinc-700">
        <div
          className="bg-orange h-full rounded-full transition-all duration-500 ease-out shadow-xs"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-zinc-400 font-body">
        <span>{completed} of {total} tasks completed</span>
        <span>{total - completed} remaining</span>
      </div>
    </div>
  );
};

export default ProgressBar;
