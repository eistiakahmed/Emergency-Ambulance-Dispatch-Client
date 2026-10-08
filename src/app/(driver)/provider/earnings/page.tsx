import type { Metadata } from "next";
import { DriverEarningsView } from "@/components/driver/DriverEarningsView";

export const metadata: Metadata = {
  title: "Earnings & Performance | PulseRescue Driver",
  description: "Completed trip metrics, distance driven and daily performance.",
};

export default function DriverEarningsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Earnings &amp; Performance
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Trip metrics, distance driven and daily breakdown.
        </p>
      </div>
      <DriverEarningsView />
    </div>
  );
}
