import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { FiSend } from "react-icons/fi";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_CHAT } from "@/graphql/queries";
import { SEND_MESSAGE } from "@/graphql/mutations";
import { useChatSocket } from "@/hooks/useChatSocket";
import toast from "react-hot-toast";

interface PackageReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    pkg: {
        id: string;
        name: string;
        description?: string;
        features?: string[];
        pricing: number;
        bookedDates?: string[] | Date[];
    };
    onPay: (date: Date) => void;
    visitorId?: string;
    offeringId?: string;
    currencyRate?: number;
}

const PackageReservationModal: React.FC<PackageReservationModalProps> = ({
    isOpen,
    onClose,
    pkg,
    onPay,
    visitorId,
    offeringId,
    currencyRate = 0.0031
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [note, setNote] = useState("");
    const [noteSent, setNoteSent] = useState(false);
    const [sending, setSending] = useState(false);

    const { sendMessage: sendSocketMessage } = useChatSocket(visitorId, 'visitor');

    const [getChat] = useLazyQuery(GET_CHAT, { fetchPolicy: 'network-only' });
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);

    const handleSendNote = async () => {
        if (!note.trim() || !visitorId || !offeringId) return;
        setSending(true);
        try {
            const { data } = await getChat({ variables: { visitorId, offeringId } });
            const chatId = data?.getChat?.chatId;
            if (!chatId) throw new Error('Could not get chat');

            // Try WebSocket first, fall back to GraphQL mutation
            try {
                await sendSocketMessage({ chatId, content: note.trim(), senderId: visitorId, senderType: 'visitor' });
            } catch {
                await sendMessageMutation({
                    variables: { chatId, content: note.trim(), visitorSenderId: visitorId }
                });
            }
            setNote("");
            setNoteSent(true);
            toast.success('Note sent to vendor!');
        } catch {
            toast.error('Failed to send note. Please try again.');
        } finally {
            setSending(false);
        }
    };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 z-10 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Package</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Package Details */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-orange/5 to-orange/10 border border-orange/20 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                                {pkg.description && (
                                    <p className="text-gray-600 leading-relaxed mb-4">{pkg.description}</p>
                                )}

                                {pkg.features && pkg.features.length > 0 && (
                                    <div className="space-y-3 mt-4 pt-4 border-t border-orange/10">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Included Features</h4>
                                        {pkg.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start">
                                                <svg
                                                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-gray-700 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Send note to vendor */}
                            {visitorId && offeringId && (
                                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                                    <p className="text-sm font-semibold text-gray-600">Send a note to the vendor</p>
                                    {noteSent ? (
                                        <div className="flex items-center gap-2 text-green-600 text-sm py-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Note sent! The vendor will reply in your chat.
                                        </div>
                                    ) : (
                                        <>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Ask a question or leave a note before booking..."
                                                rows={3}
                                                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                                            />
                                            <button
                                                onClick={handleSendNote}
                                                disabled={!note.trim() || sending}
                                                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-orange text-white text-sm font-semibold hover:bg-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FiSend className="text-base" />
                                                {sending ? 'Sending...' : 'Send Note'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Calendar & Payment */}
                        <div className="flex flex-col h-full">
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

                            <div className="mt-auto space-y-4">
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
            </div>
        </div>
    );
};

export default PackageReservationModal;
