import React from "react";
import { FiSend } from "react-icons/fi";

const ContactForm: React.FC = () => {
  return (
    <section className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-10 w-full">
      <div className="text-center mb-8">
        <h2 className="font-title text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Send Us a Message
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-body max-w-md mx-auto">
          Please fill out the form below and we will get back to you as soon as possible.
        </p>
      </div>

      <form className="space-y-5 max-w-2xl mx-auto flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
              Your Name <span className="text-orange">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-orange/[0.02] border-2 border-orange/20 focus:border-orange focus:bg-white rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-body text-gray-800 placeholder-gray-400 outline-none transition-all"
              placeholder="e.g. Rachel Green"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
              Email Address <span className="text-orange">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-orange/[0.02] border-2 border-orange/20 focus:border-orange focus:bg-white rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-body text-gray-800 placeholder-gray-400 outline-none transition-all"
              placeholder="e.g. rachel@example.com"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="subject" className="text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className="w-full bg-orange/[0.02] border-2 border-orange/20 focus:border-orange focus:bg-white rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-body text-gray-800 placeholder-gray-400 outline-none transition-all"
            placeholder="How can we help you?"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="message" className="text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
            Message <span className="text-orange">*</span>
          </label>
          <textarea
            id="message"
            className="w-full bg-orange/[0.02] border-2 border-orange/20 focus:border-orange focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm font-body text-gray-800 placeholder-gray-400 outline-none transition-all resize-y"
            placeholder="Tell us about your wedding plans, vendor inquiries, or any questions..."
            rows={5}
            required
          />
        </div>

        <div className="pt-2 text-center">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange/90 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm text-xs sm:text-sm active:scale-98 font-body"
          >
            <span>Send Message</span>
            <FiSend size={15} />
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;
