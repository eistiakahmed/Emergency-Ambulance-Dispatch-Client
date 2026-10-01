import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HospitalDirectory } from "@/components/hospitals/HospitalDirectory";
import { Activity, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Hospital ICU & Emergency Bed Finder | PulseRescue",
  description:
    "Discover certified partner hospitals with real-time ICU bed and General ER bed availability across the network.",
};

export default function HospitalsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              <span>Live Hospital Bed Radar Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
              Hospital ICU & Emergency Bed Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
              Real-time telemetry showing live Intensive Care Unit (ICU) and General Emergency
              Ward capacities across all certified medical partners.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 shadow-2xs shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>24/7 Verified Bed Capacities</span>
          </div>
        </div>

        {/* Live Directory Grid with Suspense */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6"
                />
              ))}
            </div>
          }
        >
          <HospitalDirectory />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
