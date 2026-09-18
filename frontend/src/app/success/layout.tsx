import React, { Fragment } from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";


const SuccessLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      {/* Container for the header */}
      <div className="container mx-auto px-4 print:hidden">
        <Header />
      </div>

      {/* Main content with background color */}
      <div className="bg-lightYellow min-h-screen print:bg-white print:min-h-0 print:p-0">
        <div className="max-w-6xl mx-auto px-4 print:max-w-full print:p-0 print:m-0">
          {/* Content injected dynamically */}
          {children}
        </div>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </Fragment>
  );
};

export default SuccessLayout;
