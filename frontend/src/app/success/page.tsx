import PaymentSuccess from '@/components/stripe/PaymentSuccess';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PaymentSuccessSkeleton() {
  return (
    <div className="min-h-screen bg-lightYellow dark:bg-darkBg flex items-center justify-center p-4 font-body">
      <div className="bg-white dark:bg-darkSurface rounded-3xl border-2 border-orange/20 dark:border-zinc-800 shadow-xl max-w-lg w-full p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { order_id?: string | string[]; session_id?: string | string[] };
}) {
  return (
    <Suspense fallback={<PaymentSuccessSkeleton />}>
      <PaymentSuccess searchParams={searchParams} />
    </Suspense>
  );
}

