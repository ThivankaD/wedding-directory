"use client";
import  Link  from "next/link";
import React from "react";
import { MdOpenInFull } from "react-icons/md";

const ToDo = () => {
  return (
    <div className="bg-white dark:bg-darkSurface border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm container w-full">
      <h2 className="font-title text-[24px] font-bold text-gray-900 dark:text-zinc-100">To Do&#39;s</h2>
      <hr className="w-[250px] h-px my-4 bg-gray-200 border-0 dark:bg-zinc-700"></hr>
      <div className="mt-4 font-body text-[16px] text-gray-700 dark:text-zinc-300">
        <div className="flex flex-col gap-2">
          <Link href="/vendor-dashboard/new-service" className="flex flex-row items-center gap-2 hover:text-orange dark:hover:text-orange transition-colors">
            <MdOpenInFull size={20} className="text-orange" />
            <span>Create a new service</span>
          </Link>
          <Link href="/vendor-dashboard/settings" className="flex flex-row items-center gap-2 hover:text-orange dark:hover:text-orange transition-colors">
            <MdOpenInFull size={20} className="text-orange" />
            <span>Add a banner to your page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToDo;
