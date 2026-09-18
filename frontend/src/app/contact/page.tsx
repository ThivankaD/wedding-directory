import React from "react";
import Header from "@/components/shared/Headers/Header";
import Footer from "@/components/shared/Footer";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Say I Do",
  description: "Get in touch with the Say I Do wedding support team.",
};

const ContactPage: React.FC = () => {
  return (
    <div className="bg-lightYellow font-body min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-5xl space-y-8">
        {/* Top Hero Card */}
        <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-10 text-center">
          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Get in Touch
          </h1>
          <p className="text-gray-500 font-body text-xs sm:text-sm max-w-md mx-auto">
            We&apos;re here to assist you with any questions, vendor inquiries, or feedback.
          </p>

          {/* Quick Contact Bar */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6 pt-6 border-t-2 border-orange/10 text-gray-700 text-xs sm:text-sm">
            <a
              href="mailto:sayidolk@gmail.com"
              className="flex items-center gap-2 hover:text-orange transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0 border border-orange/15 shadow-xs">
                <FiMail size={15} />
              </div>
              <span className="font-semibold font-body">sayidolk@gmail.com</span>
            </a>

            <a
              href="tel:+94477864913"
              className="flex items-center gap-2 hover:text-orange transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0 border border-orange/15 shadow-xs">
                <FiPhone size={15} />
              </div>
              <span className="font-semibold font-body">+94 47 786 4913</span>
            </a>

            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0 border border-orange/15 shadow-xs">
                <FiMapPin size={15} />
              </div>
              <span className="font-medium font-body">Hapugala, Galle, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <ContactInfo />

        {/* Contact Form */}
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
