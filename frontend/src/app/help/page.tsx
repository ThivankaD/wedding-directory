import React, { Suspense } from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import HelpCenter from "@/components/help/HelpCenter";
import LoaderJelly from "@/components/shared/Loaders/LoaderJelly";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support | Say I Do",
  description:
    "Get instant answers and support for vendors and couples planning their perfect wedding on Say I Do.",
};

const HelpPage: React.FC = () => {
  return (
    <div className="bg-lightYellow min-h-screen flex flex-col font-body">
      <Header />
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <LoaderJelly />
              <p className="text-xs font-medium text-gray-500">
                Loading Help Center...
              </p>
            </div>
          </div>
        }
      >
        <HelpCenter />
      </Suspense>
      <Footer />
    </div>
  );
};

export default HelpPage;
