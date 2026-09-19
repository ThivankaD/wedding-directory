import React, { Suspense } from "react";
import VisitorHeader from "@/components/shared/Headers/VisitorHeader";
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
    <div className="bg-lightYellow dark:bg-darkBg min-h-screen flex flex-col font-body">
      <VisitorHeader />
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <LoaderJelly />
              <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
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
