import type { Metadata } from "next";
import { Suspense } from "react";
import { PatientTripHistory } from "@/components/patient/PatientTripHistory";

export const metadata: Metadata = {
  title: "My Emergency Trips & Invoices | PulseRescue",
  description:
    "View past ambulance emergency calls, trip logs, and payment receipts.",
};

export default function PatientTripsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Emergency Trip History
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Review previous ambulance dispatches, route details, hospital
          drop-offs, and receipts.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <PatientTripHistory />
      </Suspense>
    </div>
  );
}
