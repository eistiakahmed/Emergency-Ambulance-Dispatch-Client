import React from "react";
import Link from "next/link";
import {
  Activity,
  Ambulance,
  Building2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Radio,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin Dashboard | PulseRescue EMS",
  description: "Executive ambulance fleet overview, active emergencies, and hospital bed telemetry.",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Urgent Alert Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-red-50 border border-red-200 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-red-950">
              Live Dispatch Command Center Active
            </h2>
            <p className="text-xs text-red-700">
              Haversine nearest-unit spatial matching & real-time telemetry connected to /api/v1.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/dispatch">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-bold gap-1.5 shadow-xs"
            >
              <span>View Dispatch Queue</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Active Emergencies
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">3</span>
            <span className="text-xs font-bold text-red-600">Pending Triage</span>
          </div>
          <p className="text-xs text-stone-500">2 Critical, 1 High Priority</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Fleet Operational
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Ambulance className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">12 / 14</span>
            <span className="text-xs font-bold text-emerald-600">85.7% Ready</span>
          </div>
          <p className="text-xs text-stone-500">8 BLS, 4 ALS, 2 Neonatal</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Available ICU Beds
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">48</span>
            <span className="text-xs font-bold text-cyan-600">Across 18 ERs</span>
          </div>
          <p className="text-xs text-stone-500">Live Hospital Sync Online</p>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Today&apos;s Dispatches
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">29 Trips</span>
            <span className="text-xs font-bold text-purple-600">99.8% Succeeded</span>
          </div>
          <p className="text-xs text-stone-500">Avg. Response: 6.4 mins</p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Triage Queue Wireframe */}
        <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Recent Emergency Inflow Queue
              </h2>
              <p className="text-xs text-stone-500">
                Incoming calls awaiting nearest ambulance dispatch assignment.
              </p>
            </div>
            <Link
              href="/admin/dispatch"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Full Workbench</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Wireframe Sample Items */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-red-200/80 bg-red-50/40 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-red-600 text-white uppercase tracking-wider">
                    CRITICAL
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    Severe Chest Pain & Acute Dyspnea
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Patient: Mohammad Karim • Location: Gulshan-2, Dhaka • ETA: 4 mins
                </p>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold shrink-0">
                Auto-Dispatch ALS #04
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-500 text-white uppercase tracking-wider">
                    HIGH
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    Road Traffic Accident (Multiple Fractures)
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Patient: Nusrat Jahan • Location: Mohakhali Flyover • ETA: 6 mins
                </p>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0">
                Auto-Dispatch BLS #02
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Toolbox */}
        <div className="lg:col-span-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">
            Dispatch Tools & Actions
          </h2>

          <div className="space-y-2">
            <Link
              href="/admin/manage"
              className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Ambulance className="h-4 w-4 text-stone-700" />
                <span className="text-xs font-bold text-stone-800">
                  Fleet & Vehicle Maintenance
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-400" />
            </Link>

            <Link
              href="/admin/manage"
              className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-stone-700" />
                <span className="text-xs font-bold text-stone-800">
                  Hospital ER / ICU Bed Telemetry
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-400" />
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="h-4 w-4 text-stone-700" />
                <span className="text-xs font-bold text-stone-800">
                  System Audit Logs & Governance
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-400" />
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Full System Operational</span>
            </div>
            <p className="text-[11px] text-stone-500">
              PostgreSQL, Redis & Stripe Webhooks responding at &lt; 45ms latency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
