import React from "react";
import VendorHeader from "@/components/shared/Headers/VendorHeader";
import Footer from "@/components/shared/Footer";

const VendorDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-lightYellow dark:bg-darkBg flex flex-col transition-colors duration-200">
      <VendorHeader />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default VendorDashboardLayout;
