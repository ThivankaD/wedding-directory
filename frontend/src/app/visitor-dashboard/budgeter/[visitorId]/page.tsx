"use client"
import { useQuery } from '@apollo/client';
import { GET_BUDGET_TOOL } from '@/graphql/queries';
import { useParams } from 'next/navigation';
import BudgetHeader from '@/components/visitor-dashboard/budgeter/BudgetHeader';
import TotalCost from '@/components/visitor-dashboard/budgeter/TotalCost';
import AmountPaid from '@/components/visitor-dashboard/budgeter/AmountPaid';
import BudgetItemsPanel from '@/components/visitor-dashboard/budgeter/BudgetItemsPanel';
import CreateBudgetTool from '@/components/visitor-dashboard/budgeter/CreateBudgetTool';
import { BudgetItemData } from '@/types/budgeterTypes';
import LoaderHelix from '@/components/shared/Loaders/LoaderHelix';

interface Package {
  pricing?: number;
  offering?: {
    category?: string;
  };
}

interface Payment {
  amount: number;
  package?: Package;
}

const BudgeterPage = () => {
  const { visitorId } = useParams() as { visitorId: string };

  const { data, loading, error } = useQuery(GET_BUDGET_TOOL, {
    variables: { visitorId },
    skip: !visitorId,
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <LoaderHelix />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border-2 border-orange/20 max-w-lg mx-auto mt-12">
        <p className="text-red-500 font-semibold mb-2">Error loading budget</p>
        <p className="text-xs text-gray-500">{error.message}</p>
      </div>
    );
  }

  const budgetTool = data?.budgetTool;
  const budgetToolId: string = data?.budgetTool?.id;
  
  // Filter visitorPayments to ONLY include completed payments
  const completedPayments = (data?.visitorPayments || []).filter(
    (p: { status?: string }) => p.status?.toUpperCase() === 'COMPLETED'
  );

  // Process payments by category using only completed payments
  const paymentsByCategory = completedPayments.reduce((acc: { [key: string]: number }, payment: Payment) => {
    if (payment.package?.offering?.category) {
      const category = payment.package.offering.category;
      acc[category] = (acc[category] || 0) + payment.amount;
    }
    return acc;
  }, {});

  if (budgetToolId == null) {
    return (
      <div className="w-full">
        <CreateBudgetTool visitorId={visitorId} />
      </div>
    );
  }

  // Calculate total cost including both budget items and completed package prices
  const totalCost = budgetTool.budgetItems.reduce((sum: number, item: BudgetItemData) => {
    return sum + item.estimatedCost;
  }, 0) + completedPayments.reduce((sum: number, payment: Payment) => {
    return sum + (payment.package?.pricing || 0);
  }, 0);

  // Calculate amount paid including both manual entries and completed payment amounts
  const amountPaid = budgetTool.budgetItems.reduce((sum: number, item: BudgetItemData) => {
    const itemCat = item.category?.trim() ? item.category : 'Venues';
    const categoryPayments = paymentsByCategory[itemCat] || 0;
    return sum + item.amountPaid + categoryPayments;
  }, 0) + completedPayments.reduce((sum: number, payment: Payment) => {
    return sum + (payment.amount || 0);
  }, 0);

  // Add defaulted values for safety
  const safeAmountPaid = amountPaid || 0;
  const safeTotalCost = totalCost || 0;

  return (
    <div className="w-full space-y-6">
      <BudgetHeader budget={budgetTool.totalBudget} totalCost={totalCost} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <TotalCost totalCost={safeTotalCost} budget={budgetTool.totalBudget} />
        <AmountPaid amountPaid={safeAmountPaid} totalCost={totalCost} />
      </div>
      <div>
        <BudgetItemsPanel 
          budgetToolId={budgetToolId}
          visitorId={visitorId}
          categoryPayments={paymentsByCategory}
          payments={completedPayments}
        />
      </div>
    </div>
  );
};

export default BudgeterPage;