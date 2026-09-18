'use client';

import React, { useState, useEffect } from "react";
import { UPDATE_GUESTLIST } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { X, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

export interface Guest {
  id: string;
  no: string;
  name: string;
  number: string;
  address: string;
  contact: string;
  email: string;
  status: string;
}

interface EditGuestProps {
  isVisible: boolean;
  onClose: () => void;
  guest: Guest;
  onSave: () => void;
}

const EditGuest: React.FC<EditGuestProps> = ({ isVisible, onClose, guest, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    number: "1",
    address: "",
    contact: "",
    email: "",
    status: "Invited",
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || "",
        number: guest.number || "1",
        address: guest.address || "",
        contact: guest.contact || "",
        email: guest.email || "",
        status: guest.status || "Invited",
      });
    }
  }, [guest]);

  const [updateGuestList, { loading }] = useMutation(UPDATE_GUESTLIST);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGuestList({
        variables: {
          id: guest.id,
          input: {
            number: formData.number || '1',
            address: formData.address.trim(),
            contact: formData.contact.trim(),
            email: formData.email.trim(),
            status: formData.status,
          },
        },
      });
      toast.success("Guest updated successfully!");
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error updating guest:", error);
      toast.error(error.message || "Failed to update guest");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-2xl p-6 sm:p-8 max-w-lg w-full animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-orange/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <Edit2 size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-title text-gray-900">Edit Guest</h2>
              <p className="text-xs text-gray-500 font-body">Update details for {guest.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-orange/10 hover:text-orange flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
                Guest Name
              </label>
              <input
                type="text"
                className="w-full h-11 px-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold text-gray-500 cursor-not-allowed"
                value={formData.name}
                disabled
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
                Party of
              </label>
              <select
                name="number"
                className="w-full h-11 px-3 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm text-gray-900 font-bold focus:outline-none transition-colors"
                value={formData.number}
                onChange={handleChange}
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
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
                Contact Number
              </label>
              <input
                type="text"
                name="contact"
                className="w-full h-11 px-3.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-orange/[0.02] text-sm text-gray-900 focus:outline-none transition-colors"
                placeholder="+94 77 123 4567"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full h-11 px-3.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-orange/[0.02] text-sm text-gray-900 focus:outline-none transition-colors"
                placeholder="kasun@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                className="w-full h-11 px-3.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-orange/[0.02] text-sm text-gray-900 focus:outline-none transition-colors"
                placeholder="123 Flower Road, Colombo"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
                Status
              </label>
              <select
                name="status"
                className="w-full h-11 px-3 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm text-gray-900 font-medium focus:outline-none transition-colors"
                value={formData.status}
                onChange={handleChange}
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
          <div className="pt-4 border-t border-orange/15 flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold text-sm transition-colors cursor-pointer"
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
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGuest;
