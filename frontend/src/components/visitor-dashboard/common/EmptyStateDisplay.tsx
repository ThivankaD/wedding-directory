import React from "react";

interface EmptyStateDisplayProps {
  Icon: React.ElementType;
  message: string;
}

const EmptyStateDisplay: React.FC<EmptyStateDisplayProps> = ({
  Icon,
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-5 px-4 bg-orange/[0.03] dark:bg-orange/[0.06] border border-dashed border-orange/20 dark:border-orange/30 rounded-xl">
      <div className="w-9 h-9 rounded-xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center text-orange mb-2 shadow-xs">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 text-center font-body">
        {message}
      </p>
    </div>
  );
};

export default EmptyStateDisplay;
