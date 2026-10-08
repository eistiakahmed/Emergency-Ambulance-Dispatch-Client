import type { Metadata } from "next";
import { Suspense } from "react";
import { FleetManager } from "@/components/admin/FleetManager";

export const metadata: Metadata = {
  title: "Ambulance Fleet & Driver Governance | PulseRescue Admin",
  description:
    "Live monitoring of ambulance fleet readiness, ALS equipment, and driver assignments.",
};

export default function AdminFleetPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Ambulance Fleet & Drivers
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Real-time readiness monitoring for Advanced Life Support (ALS) and
          Basic Life Support (BLS) ambulances.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <FleetManager />
      </Suspense>
    </div>
  );
}
