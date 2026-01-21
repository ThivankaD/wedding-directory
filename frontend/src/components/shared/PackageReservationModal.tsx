import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";

interface PackageReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    pkg: {
        id: string;
        name: string;
        pricing: number;
        bookedDates?: string[] | Date[];
    };
    onPay: (date: Date) => void;
    currencyRate?: number; // Optional LKR to USD rate for display
}

const PackageReservationModal: React.FC<PackageReservationModalProps> = ({
    isOpen,
    onClose,
    pkg,
    onPay,
    currencyRate = 0.0031
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    if (!isOpen) return null;

    // Convert bookedDates to Date objects
    const bookedDates = (pkg.bookedDates || []).map(d =>
        typeof d === 'string' ? parseISO(d) : d
    );

    const isDateDisabled = (date: Date) => {
        // Disable past dates
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;

        // Disable booked dates
        return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
    };

    const handlePay = () => {
        if (selectedDate) {
            onPay(selectedDate);
        }
    };

    const advanceAmount = pkg.pricing * 0.2;
    const advanceAmountUSD = (advanceAmount * currencyRate).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Package</h2>
                    <p className="text-gray-600 mb-4">
                        Select a date for <span className="font-semibold text-orange">{pkg.name}</span>
                    </p>

                    <div className="flex justify-center border rounded-lg p-4 mb-6 bg-gray-50">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={isDateDisabled}
                            className="rounded-md border bg-white shadow-sm"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="bg-orange/10 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Package Price</span>
                                <span className="font-semibold">LKR {pkg.pricing.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-orange font-bold text-lg">
                                <span>Advance (20%)</span>
                                <span>LKR {advanceAmount.toLocaleString()}</span>
                            </div>
                            <div className="text-right text-xs text-gray-500 mt-1">
                                ≈ ${advanceAmountUSD} USD
                            </div>
                        </div>

                        <Button
                            onClick={handlePay}
                            disabled={!selectedDate}
                            className="w-full bg-orange hover:bg-orange-600 text-white font-bold py-6 text-lg rounded-full"
                        >
                            {selectedDate ?
                                `Pay Advance for ${format(selectedDate, 'MMM d, yyyy')}` :
                                'Select a Date to Continue'
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageReservationModal;
