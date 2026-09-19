import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { CREATE_BUDGET_ITEM } from '@/graphql/mutations';
import toast from 'react-hot-toast';
import { BudgetItemPopupProps } from '@/types/budgeterTypes';
import budgetCategories from "@/utils/budgetCategories";

const BudgetItemPopup: React.FC<BudgetItemPopupProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           budgetToolId,
                                                           onItemAdded,
                                                         }) => {
  const initialFormState = {
    itemName: '',
    category: budgetCategories[0] || 'Venues',
    estimatedCost: '',
    amountPaid: '',
    specialNotes: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const [createBudgetItem, { loading }] = useMutation(CREATE_BUDGET_ITEM, {
    onCompleted: () => {
      toast.success('Budget item added successfully');
      onItemAdded?.();
      onClose();
      setFormData(initialFormState);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const estimatedCost = parseFloat(formData.estimatedCost);
    const amountPaid = parseFloat(formData.amountPaid);

    if (isNaN(estimatedCost) || estimatedCost <= 0) {
      toast.error('Please enter a valid estimated cost');
      return;
    }

    if (isNaN(amountPaid)) {
      toast.error('Please enter a valid amount paid');
      return;
    }

    const input = {
      itemName: formData.itemName,
      category: formData.category?.trim() || budgetCategories[0] || 'Venues',
      estimatedCost: estimatedCost,
      amountPaid: amountPaid || 0,
      specialNotes: formData.specialNotes,
      budgetToolId: budgetToolId
    };

    createBudgetItem({
      variables: {
        input
      }
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-3xl bg-white dark:bg-darkSurface border-2 border-orange/20 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange/15 dark:border-zinc-800">
            <Dialog.Title className="text-xl sm:text-2xl font-bold font-title text-gray-900 dark:text-zinc-100">
              Add New Budget Item
            </Dialog.Title>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-darkElevated hover:bg-orange/10 hover:text-orange flex items-center justify-center text-gray-500 dark:text-zinc-400 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 font-body uppercase tracking-wider">Item Name</label>
              <Input
                value={formData.itemName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    itemName: e.target.value,
                  }))
                }
                placeholder="e.g. Wedding Reception Hall"
                className="w-full h-11 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-orange/[0.02] dark:bg-darkElevated text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 font-body uppercase tracking-wider">Budget Category</label>
              <select
                value={formData.category || budgetCategories[0] || 'Venues'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full rounded-xl border-2 border-orange/20 dark:border-zinc-700 focus:border-orange font-body bg-white dark:bg-darkElevated px-3 h-11 text-sm text-gray-900 dark:text-zinc-100 focus:outline-none"
                required
              >
                {budgetCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 font-body uppercase tracking-wider">Estimated Cost</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedCost: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className="w-full h-11 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-orange/[0.02] dark:bg-darkElevated text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 font-body uppercase tracking-wider">Amount Paid</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amountPaid}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amountPaid: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className="w-full h-11 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl bg-orange/[0.02] dark:bg-darkElevated text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300 font-body uppercase tracking-wider">Notes (Optional)</label>
              <textarea
                value={formData.specialNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specialNotes: e.target.value,
                  }))
                }
                placeholder="Add notes about deposits, due dates, package choices..."
                className="w-full p-3 border-2 border-orange/20 dark:border-zinc-700 focus:border-orange rounded-xl h-20 resize-none text-sm bg-orange/[0.02] dark:bg-darkElevated text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-orange hover:bg-orange/90 text-white font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Expense Item"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BudgetItemPopup;