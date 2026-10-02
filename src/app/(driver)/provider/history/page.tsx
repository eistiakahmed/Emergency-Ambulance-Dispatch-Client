import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DriverHistoryView } from "@/components/driver/DriverHistoryView";

export const metadata: Metadata = {
  title: "Driver Shift & Mission History | Driver Console",
  description:
    "Review completed emergency transfers, travel distances, fares, and shift performance logs.",
};

export default function DriverHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Shift & Mission History
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Archived log of completed emergency hospital transfers, route distances, and shift telemetry.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <DriverHistoryView />
      </Suspense>
    </div>
  );
}
