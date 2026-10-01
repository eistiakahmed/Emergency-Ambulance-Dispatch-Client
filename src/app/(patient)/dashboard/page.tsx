import React from "react";
import Link from "next/link";
import {
  Siren,
  Ambulance,
  Building2,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Patient Dashboard | PulseRescue EMS",
  description: "Request an ambulance, track your ongoing emergency dispatch, and view medical trip history.",
};

export default function PatientDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Urgent Emergency Booking Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white p-6 sm:p-8 shadow-xl shadow-red-600/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Siren className="h-3.5 w-3.5 animate-pulse" />
              <span>24/7 Rapid Medical Dispatch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Need an Immediate Emergency Ambulance?
            </h2>
            <p className="text-sm text-red-100 font-medium">
              Nearest Basic or Advanced Life Support units auto-dispatched within 60 seconds with live GPS telemetry.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <Link href="/dashboard/emergency/new" className="block w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-8 bg-white hover:bg-stone-100 text-red-700 font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-black/10 gap-2.5 transition-all hover:scale-105"
              >
                <Siren className="h-5 w-5 text-red-600 animate-bounce" />
                <span>Book Ambulance Now</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decorative glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* 2. Active Trip Preview / Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Trip Tracker Card */}
        <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-base font-bold text-stone-900">
                Active Medical Care Status
              </h3>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-stone-100 text-stone-700">
              No Active Emergencies
            </span>
          </div>

          {/* Clean Empty State Placeholder */}
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <HeartPulse className="h-6 w-6 text-stone-500" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-bold text-stone-900">
                You have no active emergency dispatches right now
              </h4>
              <p className="text-xs text-stone-500">
                When you request an ambulance, live driver location, ETA countdown, and paramedic contacts will appear here.
              </p>
            </div>
            <Link href="/dashboard/emergency/new">
              <Button size="sm" variant="outline" className="text-xs font-bold border-stone-300">
                Test Emergency Request Flow
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Patient Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">
              Emergency Shortcuts
            </h3>

            <div className="space-y-2">
              <Link
                href="/hospitals"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-cyan-600" />
                  <span className="text-xs font-bold text-stone-800">
                    Find Available Hospital Beds
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>

              <Link
                href="/dashboard/payments"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-800">
                    Payment History & Invoices
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-stone-700" />
                  <span className="text-xs font-bold text-stone-800">
                    My Medical & Emergency Profile
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
