"use client";

import React from "react";
import { FiHeart, FiLock, FiSettings } from "react-icons/fi";

interface ProfileMenuProps {
  setActiveSection: (section: string) => void;
  activeSection?: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  setActiveSection,
  activeSection = "weddingDetails",
}) => {
  const menuItems = [
    {
      id: "weddingDetails",
      label: "Wedding Details",
      description: "Couple names, dates & venue",
      icon: FiHeart,
    },
    {
      id: "accountDetails",
      label: "Account Details",
      description: "Email & security password",
      icon: FiLock,
    },
  ];

  return (
    <div className="bg-white shadow-sm border border-orange/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-orange/15">
        <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange shrink-0">
          <FiSettings className="text-lg" />
        </div>
        <div>
          <h2 className="font-title font-bold text-xl text-gray-900 leading-tight">
            Settings
          </h2>
          <p className="text-xs text-gray-400 font-body">Preferences & account</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex flex-col gap-1.5 font-body">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? "bg-orange text-white shadow-md shadow-orange/20 font-medium"
                  : "text-gray-600 hover:bg-orange/5 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`text-lg flex-shrink-0 ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-snug">
                  {item.label}
                </span>
                <span
                  className={`text-[11px] ${
                    isActive ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileMenu;