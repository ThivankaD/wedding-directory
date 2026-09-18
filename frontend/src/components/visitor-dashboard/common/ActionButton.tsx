import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface ActionButtonProps {
  href: string;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ href, label }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-orange/[0.07] hover:bg-orange text-orange hover:text-white border border-orange/20 hover:border-orange font-semibold text-xs sm:text-sm transition-all duration-200 shadow-xs group font-body"
    >
      <span>{label}</span>
      <FiArrowRight className="text-xs sm:text-sm transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
};

export default ActionButton;
