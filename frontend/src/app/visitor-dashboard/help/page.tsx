import React, { Suspense } from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import HelpCenter from "@/components/help/HelpCenter";
import LoaderJelly from "@/components/shared/Loaders/LoaderJelly";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Couple Help & Support | Say I Do",
  description:
    "Get wedding planning help, answers, and support for your big day on Say I Do.",
};

const VisitorDashboardHelpPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-orange/[0.03] via-white to-orange/[0.03] min-h-screen flex flex-col font-body">
      <Header />
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <LoaderJelly />
              <p className="text-xs font-medium text-gray-500">
                Loading Couple Help Center...
              </p>
            </div>
          </div>
        }
      >
        <HelpCenter initialRole="visitor" />
      </Suspense>
      <Footer />
    </div>
  );
};

export default VisitorDashboardHelpPage;
