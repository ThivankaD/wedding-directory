import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentSuccess from "@/components/stripe/PaymentSuccess";

function PaymentPendingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8 dark:border-amber-900/50 dark:bg-darkSurface">
      <div className="flex flex-col items-center gap-3 text-center">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="mt-6 space-y-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}

export default function PaymentPendingPage({
  searchParams,
}: {
  searchParams?: { order_id?: string | string[] };
}) {
  return (
    <Suspense fallback={<PaymentPendingSkeleton />}>
      <PaymentSuccess searchParams={searchParams} />
    </Suspense>
  );
}
