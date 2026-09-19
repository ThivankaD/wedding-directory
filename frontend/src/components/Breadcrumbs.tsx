// components/shared/Breadcrumbs.tsx
import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-body">
      <ol className="flex items-center space-x-1 sm:space-x-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-gray-700 dark:text-zinc-300 font-title hover:underline hover:text-orange dark:hover:text-orange transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-zinc-400 font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-1.5 sm:mx-2 text-gray-400 dark:text-zinc-600 select-none">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
