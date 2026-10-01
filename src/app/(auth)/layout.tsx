import React from "react";
import Link from "next/link";
import { Siren, PhoneCall, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Authentication | PulseRescue Emergency Dispatch",
  description:
    "Sign in or register for PulseRescue Emergency Ambulance Dispatch System. Instant access for Patients, Drivers, and Dispatch Admins.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans">
      {/* 1. Top Urgent Emergency Alert Bar */}
      <div className="bg-red-600 text-white py-1.5 px-4 text-[11px] sm:text-xs font-bold tracking-wide text-center flex items-center justify-center">
        <span className="truncate">24/7 NATIONAL EMERGENCY AMBULANCE DISPATCH • HOTLINE 999</span>
      </div>

      {/* 2. Main Navbar matching Home Page */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white shadow-xs">
        <div className="mx-auto flex h-16 sm:h-20 max-w-[1536px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/25 group-hover:bg-red-700 transition-colors">
              <Siren className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                PulseRescue
                <span className="inline-block h-2 w-2 rounded-full bg-red-600" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-500 leading-none">
                Emergency Command
              </span>
            </div>
          </Link>

          {/* Right: Back to Home & 999 Hotline */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">Back to Home</span>
              <span className="inline xs:hidden">Home</span>
            </Link>

            <a
              href="tel:999"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-sm hover:bg-red-700 transition-all hover:scale-105"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>999</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. Centered Content Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-xl mx-auto">{children}</div>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-stone-200 bg-white py-4">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-8 text-center text-xs text-stone-500 font-medium">
          © {new Date().getFullYear()} PulseRescue Emergency Dispatch System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
