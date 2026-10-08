import { ArrowLeft, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmergencyBookingForm } from "@/components/patient/EmergencyBookingForm";

export const metadata: Metadata = {
  title: "Request Instant Ambulance SOS | PulseRescue",
  description:
    "Broadcast high-priority medical emergency SOS to dispatch nearest ICU ambulances and verify hospital bed availability.",
};

export default function NewEmergencyPage() {
  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
              Request Emergency Ambulance SOS
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-200">
              Direct Dispatch
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Fill in the medical emergency triage details below for rapid
            dispatch routing.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold shrink-0">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <span>Priority Emergency Queue</span>
        </div>
      </div>

      {/* Booking Form */}
      <EmergencyBookingForm />
    </div>
  );
}
