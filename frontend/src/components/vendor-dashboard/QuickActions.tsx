"use client";
import React from "react";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";

const QuickActions = () => {
  return (
    <div className="bg-white dark:bg-darkSurface border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm w-full container">
      <h2 className="font-title text-[24px] font-bold text-gray-900 dark:text-zinc-100">Quick Actions</h2>
      <hr className="w-[250px] h-px my-4 bg-gray-200 border-0 dark:bg-zinc-700"></hr>
      <div className="mt-4 space-y-4 font-body text-[16px] text-gray-700 dark:text-zinc-300">
        
          <Link href="/vendor-dashboard/new-service" className="flex items-center gap-2 hover:text-orange dark:hover:text-orange transition-colors">
            <FaLink size={20} className="text-orange" /> Add or Remove Service
          </Link>
        
        
          <Link href="/vendor-dashboard/settings" className="flex items-center gap-2 hover:text-orange dark:hover:text-orange transition-colors">
            <FaLink size={20} className="text-orange" /> Edit Public Business Profile
          </Link>
        
          <Link href="/vendor-dashboard/settings" className="flex items-center gap-2 hover:text-orange dark:hover:text-orange transition-colors">
            <FaLink size={20} className="text-orange" /> Edit Photos & Media
          </Link>
        
     

      </div>
    </div>
  );
};

export default QuickActions;
