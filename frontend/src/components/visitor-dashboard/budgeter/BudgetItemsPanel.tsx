import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BUDGET_ITEMS } from '@/graphql/queries';
import BudgetItem from '@/components/visitor-dashboard/budgeter/BudgetItem';
import { Search, Plus } from 'lucide-react';
import { DELETE_BUDGET_ITEM, UPDATE_BUDGET_ITEM } from '@/graphql/mutations';
import BudgetItemPopup from '@/components/visitor-dashboard/budgeter/BudgetItemPopup';
import { toast } from 'react-hot-toast';
import PaymentItem from './PaymentItem';

import { BudgetItemsPanelProps, BudgetItemData, UpdateBudgetItemInput, PaymentData } from '@/types/budgeterTypes';
import budgetCategories from '@/utils/budgetCategories';

const getValidCategory = (cat?: string | null) => {
  if (!cat || cat.trim() === '' || cat.toLowerCase() === 'uncategorized') {
    return budgetCategories[0] || 'Venues';
  }
  return cat;
};

const BudgetItemsPanel: React.FC<BudgetItemsPanelProps> = ({ 
  budgetToolId,
  categoryPayments = {}, // Add default empty object for categoryPayments
  payments = [] // Add payments with default empty array
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const {
    data: budgetItemsData,
    loading: budgetItemsLoading,
    error: budgetItemsError,
    refetch: refetchBudgetItems
  } = useQuery(GET_BUDGET_ITEMS, {
    variables: { budgetToolId },
    skip: !budgetToolId,
  });

  const [updateBudgetItem] = useMutation(UPDATE_BUDGET_ITEM, {
    onCompleted: () => {
      // Refetch to get updated data
      refetchBudgetItems().then(
        () => toast.success('Budget item updated successfully'));
    },
    onError: (error) => {
      console.error('Error updating budget item:', error);
      toast.error('Error updating budget item' );
    }
  });

  const [deleteBudgetItem] = useMutation(DELETE_BUDGET_ITEM, {
    onCompleted: () => {
      refetchBudgetItems().then(
        () => toast.success('Budget item deleted successfully'));
    },
    onError: (error) => {
      toast.error('Error deleting budget item: ' + error.message);
    }
  });

  const handleUpdateBudgetItem = async (itemId: string, data: UpdateBudgetItemInput) => {
    try {
      const formattedData = {
        ...data,
        amountPaid: data.paidAmount, // ✅ Map paidAmount to amountPaid
      };
      delete formattedData.paidAmount; // ✅ Remove incorrect field

      await updateBudgetItem({
        variables: {
          id: itemId,
          updateBudgetItemInput: formattedData,
        },
      });
    } catch (error) {
      console.error('Error in handleUpdateBudgetItem:', error);
    }
  };


  const handleDeleteBudgetItem = async (itemId: string) => {
    try {
      await deleteBudgetItem({
        variables: {
          id: itemId
        }
      });
    } catch (error) {
      console.error('Error in handleDeleteBudgetItem:', error);
    }
  };

  if (budgetItemsLoading) return <div>Loading...</div>;
  if (budgetItemsError) return <div>Error: {budgetItemsError.message}</div>;

  const budgetItems: BudgetItemData[] = budgetItemsData?.budgetItems || [];
  const totalItems = budgetItems.length;
  
  // Update paidInFullItems calculation to include external payments
  const paidInFullItems = budgetItems.filter((item) => {
    const itemCat = getValidCategory(item.category);
    const categoryPaidAmount = categoryPayments[itemCat] || 0;
    const totalPaidAmount = item.amountPaid + categoryPaidAmount;
    return totalPaidAmount >= item.estimatedCost;
  }).length;

  const filteredItems = budgetItems.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderBudgetItems = () => {
    // Group items by category (normalizing user added items without category into their valid category)
    const groupedItems = filteredItems.reduce((acc: { [key: string]: BudgetItemData[] }, item) => {
      const category = getValidCategory(item.category);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    // Group payments by category
    const groupedPayments = payments.reduce((acc: { [key: string]: PaymentData[] }, payment) => {
      if (payment.package?.offering?.category) {
        const category = getValidCategory(payment.package.offering.category);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(payment);
      }
      return acc;
    }, {});

    // Combine unique categories from both items and payments
    const allCategories = new Set([
      ...Object.keys(groupedItems),
      ...Object.keys(groupedPayments)
    ]);

    // Render items by category
    return Array.from(allCategories).map((category) => (
      <div key={category} className="mb-6">
        {/* Category Header */}
        <div className="bg-orange/[0.06] px-5 py-3 rounded-2xl border-2 border-orange/15 font-title font-bold text-gray-900 flex items-center justify-between text-base sm:text-lg">
          <span>{category}</span>
        </div>

        {/* Category Items */}
        <div className="space-y-3 mt-3">
          {/* Render Budget Items */}
          {groupedItems[category]?.map((item) => {
            const itemCat = getValidCategory(item.category);
            return (
              <BudgetItem
                key={`item-${item.id}`}
                itemId={item.id}
                itemName={item.itemName}
                estimatedCost={item.estimatedCost}
                paidAmount={item.amountPaid}
                category={itemCat}
                specialNotes={item.specialNotes}
                onSave={(data) => handleUpdateBudgetItem(item.id, data)}
                onDelete={() => handleDeleteBudgetItem(item.id)}
                externalPayments={categoryPayments[itemCat] || 0}
              />
            );
          })}

          {/* Render Related Payments */}
          {groupedPayments[category]?.map((payment) => (
            <PaymentItem
              key={`payment-${payment.id}`}
              payment={payment}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-orange/15">
        <div>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-gray-900">Budget Items</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-body">Track, manage, and record expenses for all wedding categories.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-orange/[0.05] border border-orange/15 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700">
            <span>Total Items:</span>
            <strong className="text-orange font-bold">{totalItems}</strong>
          </div>
          <div className="flex items-center gap-2 bg-orange/[0.05] border border-orange/15 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700">
            <span>Paid in Full:</span>
            <strong className="text-orange font-bold">{paidInFullItems}</strong>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange hover:bg-orange/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <BudgetItemPopup
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        budgetToolId={budgetToolId}
        onItemAdded={() => refetchBudgetItems()}
      />

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search budget items..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-orange/[0.02] border-2 border-orange/20 focus:border-orange rounded-xl focus:outline-none focus:ring-1 focus:ring-orange text-gray-800 placeholder-gray-400 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {/* Budget Items grouped by category */}
      <div>
        {renderBudgetItems()}
      </div>
    </div>
  );
};

export default BudgetItemsPanel;