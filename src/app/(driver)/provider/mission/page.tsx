import type { Metadata } from "next";
import { Suspense } from "react";
import { DriverMissionView } from "@/components/driver/DriverMissionView";

export const metadata: Metadata = {
  title: "Active Emergency Mission & Waypoint Navigation | Driver Console",
  description:
    "Real-time emergency dispatch waypoint tracker, patient stabilization milestones, and hospital ER drop-off routing.",
};

export default function DriverMissionPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Active Mission & Navigation
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Live milestone progression from dispatch acceptance to patient
          transport and hospital ER handover.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <DriverMissionView />
      </Suspense>
    </div>
  );
}
