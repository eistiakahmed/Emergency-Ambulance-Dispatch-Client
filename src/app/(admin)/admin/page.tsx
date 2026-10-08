import { Ambulance, Building2, Radio } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { DispatchWorkbench } from "@/components/admin/DispatchWorkbench";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Central Command & Dispatch Workbench | PulseRescue",
  description:
    "Real-time emergency dispatch management, ambulance fleet monitoring, and hospital bed capacity command.",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Header Overview with Quick Command Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
            Emergency Command Center
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Live national dispatch overview, active ICU fleet distribution, and
            hospital intake network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/hospitals">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 border-stone-300 hover:bg-stone-100"
            >
              <Building2 className="h-3.5 w-3.5 text-stone-600" />
              <span>Manage Hospitals</span>
            </Button>
          </Link>

          <Link href="/admin/fleet">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 border-stone-300 hover:bg-stone-100"
            >
              <Ambulance className="h-3.5 w-3.5 text-stone-600" />
              <span>Fleet Control</span>
            </Button>
          </Link>

          <Link href="/admin/dispatch">
            <Button
              variant="emergency"
              size="sm"
              className="text-xs font-bold gap-1.5 shadow-xs"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Dispatch Queue</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Real-time KPI Stats Grid */}
      <AdminKpiGrid />

      {/* 3. Analytics & Volume Trend Chart */}
      <AnalyticsChart />

      {/* 4. Live Dispatch Queue & Workbench */}
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
