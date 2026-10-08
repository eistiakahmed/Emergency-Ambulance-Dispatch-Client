import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentHistory } from "@/components/patient/PaymentHistory";

export const metadata: Metadata = {
  title: "Payments & Receipts | PulseRescue",
  description:
    "Fare breakdowns, payment status and receipts for your ambulance trips.",
};

export default function PatientPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Payments &amp; Receipts
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Review fare breakdowns, settle outstanding trips, and open receipts.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <PaymentHistory />
      </Suspense>
    </div>
  );
}
