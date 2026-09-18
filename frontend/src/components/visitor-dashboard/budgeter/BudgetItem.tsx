import React, { useState, useEffect } from "react";
import { ChevronUp, Trash2 } from "lucide-react";
import { FiUser } from "react-icons/fi";
import {
  BudgetItemUpdateInput,
  UpdateBudgetItemInput,
} from "@/types/budgeterTypes";
import budgetCategories from "@/utils/budgetCategories";

interface BudgetItemComponentProps {
  itemId: string;
  itemName?: string;
  estimatedCost?: number;
  paidAmount?: number;
  category?: string;
  specialNotes?: string | null;
  onSave?: (input: BudgetItemUpdateInput) => void;
  onDelete?: (input: BudgetItemUpdateInput) => void;
  externalPayments: number;
}

const getValidCategory = (cat?: string | null) => {
  if (!cat || cat.trim() === "" || cat.toLowerCase() === "uncategorized") {
    return budgetCategories[0] || "Venues";
  }
  return cat;
};

const BudgetItem: React.FC<BudgetItemComponentProps> = ({
  itemName = "",
  estimatedCost = 0.0,
  paidAmount = 0.0,
  category = "",
  specialNotes = null,
  onSave = () => {},
  onDelete = () => {},
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editedValues, setEditedValues] = useState<UpdateBudgetItemInput>({
    itemName: itemName || "",
    estimatedCost,
    paidAmount,
    category: getValidCategory(category),
    specialNotes: specialNotes || "",
  });

  useEffect(() => {
    setEditedValues({
      itemName: itemName || "",
      estimatedCost,
      paidAmount,
      category: getValidCategory(category),
      specialNotes: specialNotes || "",
    });
  }, [itemName, estimatedCost, paidAmount, category, specialNotes]);

  const handleInputChange = (
    field: keyof UpdateBudgetItemInput,
    value: string | number
  ) => {
    setEditedValues((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value || "" : value,
    }));
  };

  const handleSave = () => {
    const sanitizedValues: BudgetItemUpdateInput = {
      itemName: editedValues.itemName ?? "",
      category: getValidCategory(editedValues.category),
      specialNotes: editedValues.specialNotes ?? "",
      estimatedCost: editedValues.estimatedCost ?? 0,
      paidAmount: editedValues.paidAmount ?? 0,
      isPaidInFull:
        (editedValues.estimatedCost ?? 0) === (editedValues.paidAmount ?? 0),
    };

    onSave(sanitizedValues);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete({
      itemName: editedValues.itemName ?? "",
      category: getValidCategory(editedValues.category),
      specialNotes: editedValues.specialNotes ?? "",
      estimatedCost: editedValues.estimatedCost ?? 0,
      paidAmount: editedValues.paidAmount ?? 0,
      isPaidInFull: editedValues.estimatedCost === editedValues.paidAmount,
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-orange/20 hover:border-orange/50 shadow-2xs transition-all overflow-hidden">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-title text-base sm:text-lg font-bold text-gray-900 truncate">
              {itemName}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange/10 text-orange border border-orange/20">
              <FiUser size={12} className="text-orange shrink-0" />
              <span>User Added</span>
            </span>
          </div>
          {specialNotes && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-body">{specialNotes}</p>
          )}
        </div>

        <div className="flex items-center gap-6 sm:gap-10 shrink-0">
          <div>
            <p className="text-xs text-gray-500 font-medium">Estimated Cost</p>
            <p className="font-title text-base sm:text-lg font-bold text-gray-800">
              {estimatedCost.toLocaleString()} <span className="text-xs font-semibold text-gray-500">LKR</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-emerald-600 font-medium">Amount Paid</p>
            <p className="font-title text-base sm:text-lg font-bold text-emerald-600">
              {paidAmount.toLocaleString()} <span className="text-xs font-semibold text-emerald-600/80">LKR</span>
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
            <ChevronUp
              className={`transform transition-transform duration-200 ${
                isOpen ? "" : "rotate-180"
              }`}
              size={18}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6 border-t-2 border-orange/15 bg-orange/[0.02] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-body">
                Item Name
              </label>
              <input
                type="text"
                value={editedValues.itemName}
                onChange={(e) => handleInputChange("itemName", e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-body">
                Category
              </label>
              <select
                value={getValidCategory(editedValues.category)}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm focus:outline-none"
              >
                {budgetCategories.map((cat: string) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-body">
                Estimated Cost (LKR)
              </label>
              <input
                type="number"
                value={editedValues.estimatedCost}
                onChange={(e) =>
                  handleInputChange("estimatedCost", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3.5 py-2.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-body">
                Amount Paid (LKR)
              </label>
              <input
                type="number"
                value={editedValues.paidAmount}
                onChange={(e) =>
                  handleInputChange("paidAmount", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3.5 py-2.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-body">
              Special Notes
            </label>
            <textarea
              value={editedValues.specialNotes || ""}
              onChange={(e) =>
                handleInputChange("specialNotes", e.target.value)
              }
              className="w-full p-3 border-2 border-orange/20 focus:border-orange rounded-xl min-h-[90px] bg-white text-sm focus:outline-none resize-none"
              placeholder="Add notes about deposits, options, deadlines..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold text-xs transition-colors cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              <span>Delete Item</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange text-white hover:bg-orange/90 font-semibold text-xs shadow-xs transition-all cursor-pointer"
              onClick={handleSave}
            >
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetItem;
