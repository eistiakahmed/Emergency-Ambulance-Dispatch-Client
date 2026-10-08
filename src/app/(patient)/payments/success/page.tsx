import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccessView } from "@/components/payment/PaymentSuccessView";

export const metadata: Metadata = {
  title: "Payment Receipt & Confirmation | PulseRescue Emergency",
  description:
    "Official tax invoice and payment verification receipt for emergency ambulance dispatch service.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-stone-100 animate-pulse mx-auto" />
            <div className="h-6 w-48 bg-stone-100 animate-pulse mx-auto rounded-lg" />
            <div className="h-4 w-72 bg-stone-50 animate-pulse mx-auto rounded-lg" />
          </div>
        }
      >
        <PaymentSuccessView />
      </Suspense>
    </div>
  );
}
