import type { Metadata } from "next";
import { Suspense } from "react";
import { HospitalManager } from "@/components/admin/HospitalManager";

export const metadata: Metadata = {
  title: "Hospital Bed Network & Intake Governance | PulseRescue Admin",
  description:
    "Register hospitals, configure emergency intake capabilities, and control live ICU & general bed capacities.",
};

export default function AdminHospitalsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Hospital & ICU Bed Network
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage partner hospital registrations, emergency trauma center
          capacities, and real-time bed availability.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <HospitalManager />
      </Suspense>
    </div>
  );
}
