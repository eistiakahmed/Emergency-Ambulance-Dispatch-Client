import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentCancelView } from "@/components/payment/PaymentCancelView";

export const metadata: Metadata = {
  title: "Payment Cancelled | PulseRescue Emergency",
  description:
    "Emergency ambulance payment session was cancelled. Retry options and 24/7 billing support.",
};

export default function PaymentCancelPage() {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="max-w-xl mx-auto py-12 px-4 space-y-4 text-center">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 animate-pulse mx-auto" />
            <div className="h-6 w-48 bg-stone-100 animate-pulse mx-auto rounded-lg" />
          </div>
        }
      >
        <PaymentCancelView />
      </Suspense>
    </div>
  );
}
