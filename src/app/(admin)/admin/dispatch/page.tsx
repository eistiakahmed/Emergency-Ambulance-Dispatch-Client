import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DispatchWorkbench } from "@/components/admin/DispatchWorkbench";

export const metadata: Metadata = {
  title: "Live Dispatch Workbench | PulseRescue Admin",
  description: "Real-time emergency dispatch incident queue, triage routing, and vehicle assignment.",
};

export default function AdminDispatchPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Live Dispatch Workbench
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Real-time triage queue for active emergency calls, driver allocation, and automated hospital routing.
        </p>
      </div>

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
