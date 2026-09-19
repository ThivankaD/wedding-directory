import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { X, ShieldCheck, Loader2, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@apollo/client";
import { CREATE_PACKAGE_APPROVAL_REQUEST } from "@/graphql/mutations";
import toast from "react-hot-toast";

interface PackageApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: {
    id: string;
    name: string;
    description?: string;
    features?: string[];
    pricing: number;
  };
  visitorId?: string;
  offeringId?: string;
  onSuccess?: () => void;
}

const PackageApprovalRequestModal: React.FC<PackageApprovalRequestModalProps> = ({
  isOpen,
  onClose,
  pkg,
  visitorId,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [createApprovalRequest] = useMutation(CREATE_PACKAGE_APPROVAL_REQUEST);

  if (!isOpen) return null;

  // Only past dates are disabled. Booked dates are NOT disabled because the vendor determines availability.
  const isDateDisabled = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const handleSubmit = async () => {
    if (!selectedDate || isSubmitting) return;

    if (!visitorId) {
      toast.error("Please login as a user to request vendor approval.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createApprovalRequest({
        variables: {
          input: {
            packageId: pkg.id,
            visitorId,
            bookingDate: selectedDate,
            userNote: note.trim() || undefined,
          },
        },
      });

      if (result.data?.createPackageApprovalRequest) {
        setIsSubmitted(true);
        toast.success("Approval request sent to vendor!");
        onSuccess?.();
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : "Failed to submit request";
      toast.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const advanceAmount = pkg.pricing * 0.2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-transparent dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 z-10 rounded-full hover:bg-gray-100 dark:hover:bg-darkElevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
        </button>

        {isSubmitted ? (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-title text-gray-900 dark:text-zinc-100">
              Request Sent for Vendor Approval!
            </h3>
            <p className="text-gray-600 dark:text-zinc-300 max-w-md text-sm leading-relaxed font-body">
              Your request for <span className="font-semibold text-gray-800 dark:text-zinc-100">{pkg.name}</span> on{" "}
              <span className="font-semibold text-gray-800 dark:text-zinc-100">
                {selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}
              </span>{" "}
              has been submitted to the vendor. You will be notified once they review and approve.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 rounded-xl p-4 text-xs text-blue-800 dark:text-blue-300 max-w-md flex items-center gap-2.5 text-left font-body">
              <Clock className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <span>
                Once approved, you will have <strong>24 hours</strong> to complete the 20% advance payment to lock in your date.
              </span>
            </div>
            <Button
              onClick={onClose}
              className="mt-4 bg-orange hover:bg-orange-600 text-white font-semibold px-8 py-2.5 rounded-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 font-title">
                Request Vendor Approval
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6 font-body">
              This package requires vendor approval before purchase. Choose your wedding date and submit for review.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Package Details */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50/70 to-blue-50/30 dark:from-blue-950/30 dark:to-blue-950/10 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-2 font-title">
                    {pkg.name}
                  </h3>
                  {pkg.description && (
                    <p className="text-gray-600 dark:text-zinc-300 text-sm leading-relaxed mb-4 font-body">
                      {pkg.description}
                    </p>
                  )}

                  {pkg.features && pkg.features.length > 0 && (
                    <div className="space-y-2.5 mt-4 pt-4 border-t border-blue-100 dark:border-blue-900/40">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                        Included Features
                      </h4>
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start text-xs text-gray-700 dark:text-zinc-300 font-body">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Note to vendor */}
                <div className="border border-gray-200 dark:border-zinc-700 rounded-xl p-4 space-y-2 bg-gray-50/50 dark:bg-darkElevated">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300 block">
                    Message / Special Requirements (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Provide wedding venue details, timing, guest count or any special requirements for the vendor..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-200 dark:border-zinc-700 dark:bg-darkSurface dark:text-zinc-100 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white"
                  />
                </div>

                {/* 24-Hour Notice */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5 font-body">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>24-Hour Purchase Window:</strong> If the vendor approves your request, you will receive a 24-hour window to complete payment and lock your date.
                  </span>
                </div>
              </div>

              {/* Right Column - Calendar & Submit */}
              <div className="flex flex-col h-full">
                <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3 font-body">
                  Select your desired date for{" "}
                  <span className="font-bold text-gray-900 dark:text-zinc-100">{pkg.name}</span>
                </p>

                <div className="flex justify-center border border-gray-200 dark:border-zinc-700 rounded-xl p-3 mb-6 bg-gray-50/70 dark:bg-darkElevated shadow-sm">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-darkSurface shadow-sm"
                  />
                </div>

                <div className="mt-auto space-y-4">
                  <div className="bg-gray-50 dark:bg-darkElevated p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <div className="flex justify-between items-center mb-1 text-sm text-gray-600 dark:text-zinc-400">
                      <span>Package Price</span>
                      <span className="font-semibold text-gray-800 dark:text-zinc-100">
                        LKR {pkg.pricing.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-orange font-bold text-base">
                      <span>Advance to pay after approval (20%)</span>
                      <span>LKR {advanceAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedDate || isSubmitting}
                    className="w-full bg-orange hover:bg-orange/90 text-white font-bold py-6 text-base rounded-full flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : selectedDate ? (
                      `Request Approval for ${format(selectedDate, "MMM d, yyyy")}`
                    ) : (
                      "Select an Event Date to Continue"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageApprovalRequestModal;
