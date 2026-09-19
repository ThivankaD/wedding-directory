'use client';

import React, { useState } from "react";
import { CREATE_GUESTLIST } from "@/graphql/mutations";
import { useMutation } from '@apollo/client';
import { useAuth } from "@/contexts/VisitorAuthContext";
import { X, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface AddNewGuestProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddNewGuest: React.FC<AddNewGuestProps> = ({ isVisible, onClose, onSave }) => {
  const { visitor } = useAuth();

  const [name, setName] = useState<string>('');
  const [number, setNumber] = useState<string>('1');
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>('Invited');

  const [createGuestList, { loading }] = useMutation(CREATE_GUESTLIST);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a guest name");
      return;
    }

    try {
      const response = await createGuestList({
        variables: {
          input: {
            name: name.trim(),
            number: number || '1',
            address: address.trim(),
            contact: contact.trim(),
            email: email.trim(),
            status: status || 'Invited',
            visitor_id: visitor?.id,
          },
        },
      });

      if (response.data) {
        toast.success("Guest added successfully!");
        setName("");
        setNumber("1");
        setAddress("");
        setContact("");
        setEmail("");
        setStatus("Invited");
        onSave();
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating guest:", error);
      toast.error(error.message || "Failed to add guest");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-darkSurface rounded-3xl border-2 border-orange/20 shadow-2xl p-6 sm:p-8 max-w-lg w-full animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-orange/15 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-title text-gray-900 dark:text-zinc-100">Add New Guest</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-body">Add a guest to your wedding celebration.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-darkElevated hover:bg-orange/10 dark:hover:bg-orange/20 hover:text-orange flex items-center justify-center text-gray-500 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider font-body mb-1.5">
                Guest Name *
              </label>
              <input
                type="text"
                className="w-full h-11 px-3.5 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-orange/[0.02] dark:bg-darkElevated text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                placeholder="e.g. Kasun Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider font-body mb-1.5">
                Party of
              </label>
              <select
                className="w-full h-11 px-3 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-white dark:bg-darkElevated text-sm text-gray-900 dark:text-zinc-100 font-bold focus:outline-none transition-colors"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={String(num)}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider font-body mb-1.5">
                Contact Number
              </label>
              <input
                type="text"
                className="w-full h-11 px-3.5 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-orange/[0.02] dark:bg-darkElevated text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                placeholder="+94 77 123 4567"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider font-body mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                className="w-full h-11 px-3.5 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-orange/[0.02] dark:bg-darkElevated text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                placeholder="kasun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider font-body mb-1.5">
                Address (Optional)
              </label>
              <input
                type="text"
                className="w-full h-11 px-3.5 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-orange/[0.02] dark:bg-darkElevated text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                placeholder="123 Flower Road, Colombo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider font-body mb-1.5">
                Status
              </label>
              <select
                className="w-full h-11 px-3 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-white dark:bg-darkElevated text-sm text-gray-900 dark:text-zinc-100 font-medium focus:outline-none transition-colors"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Invited">Invited</option>
                <option value="Not Invited">Not Invited</option>
                <option value="Attending">Attending</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-orange/15 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 font-semibold text-sm transition-colors cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange hover:bg-orange/90 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Guest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewGuest;
