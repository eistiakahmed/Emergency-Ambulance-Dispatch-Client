import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { DispatchWorkbench } from "@/components/admin/DispatchWorkbench";

export const metadata: Metadata = {
  title: "Admin Central Command & Dispatch Workbench | PulseRescue",
  description:
    "Real-time emergency dispatch management, ambulance fleet monitoring, and hospital bed capacity command.",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* 1. Header Overview */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Emergency Command Center
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Live national dispatch overview, active ICU fleet distribution, and hospital intake network.
        </p>
      </div>

      {/* 2. Real-time KPI Stats Grid */}
      <AdminKpiGrid />

      {/* 3. Live Dispatch Queue & Workbench */}
      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <DispatchWorkbench />
      </Suspense>
    </div>
  );
}
