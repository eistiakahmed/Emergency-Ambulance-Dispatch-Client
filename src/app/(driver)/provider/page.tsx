import React from "react";
import Link from "next/link";
import {
  Ambulance,
  Navigation,
  MapPin,
  Phone,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Radio,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Driver Active Task Console | PulseRescue EMS",
  description: "Live driver shift status, active emergency mission, and milestone state controls.",
};

export default function DriverDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Shift Availability Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-stone-900">
                Driver Shift: AVAILABLE
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                GPS Transmitting
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Assigned Vehicle: <strong className="text-stone-800">ALS ICU #04</strong> (Reg: DHA-98210)
            </p>
          </div>
        </div>

        {/* Status Mode Switches */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
          >
            AVAILABLE
          </button>
          <button
            type="button"
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            BUSY
          </button>
          <button
            type="button"
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            OFFLINE
          </button>
        </div>
      </div>

      {/* 2. Active Mission Card (FSM Wireframe) */}
      <div className="rounded-2xl border-2 border-red-500/80 bg-white p-5 sm:p-6 shadow-md shadow-red-500/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-red-600 animate-ping" />
            <h3 className="text-lg font-black text-stone-900">
              Active Mission: Trip #TRIP-88219
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-lg bg-red-100 text-red-700 uppercase">
              EN ROUTE PICKUP
            </span>
          </div>

          <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-red-600" />
            <span>Dispatched 4 mins ago</span>
          </div>
        </div>

        {/* Patient & Location Intel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Details */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>Patient Pickup Location</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-stone-900">
                House 42, Road 11, Block D, Banani, Dhaka
              </div>
              <p className="text-xs text-stone-600">
                Patient: <strong className="text-stone-900">Alice Rahman</strong> • Condition: Severe Asthma Attack
              </p>
            </div>
            <a
              href="tel:01712345678"
              className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Patient: 01712345678</span>
            </a>
          </div>

          {/* Hospital Destination */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <Building2 className="h-4 w-4 text-cyan-600" />
              <span>Destination Hospital (ER Ready)</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-stone-900">
                United Hospital ER & Trauma Bay 2
              </div>
              <p className="text-xs text-stone-600">
                ICU Bed Reserved • Paramedic Handover Prep Notified
              </p>
            </div>
            <a
              href="tel:01912345678"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-700 hover:text-cyan-800"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>ER Direct Line: 01912345678</span>
            </a>
          </div>
        </div>

        {/* Milestone Action Stepper */}
        <div className="pt-2 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
            FSM State Milestone Progression Controls
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold gap-2 text-xs sm:text-sm">
              <Navigation className="h-4 w-4" />
              <span>1. Arrived at Pickup</span>
            </Button>
            <Button
              variant="outline"
              disabled
              className="h-12 border-stone-300 font-bold text-stone-400 text-xs sm:text-sm"
            >
              <span>2. Patient Onboard</span>
            </Button>
            <Button
              variant="outline"
              disabled
              className="h-12 border-stone-300 font-bold text-stone-400 text-xs sm:text-sm"
            >
              <span>3. Complete & Settle</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
