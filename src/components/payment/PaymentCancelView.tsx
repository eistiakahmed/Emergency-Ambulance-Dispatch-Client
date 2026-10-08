"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Phone,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PaymentCheckoutModal } from "@/components/patient/PaymentCheckoutModal";
import { Button } from "@/components/ui/button";
import { useTrip } from "@/lib/hooks/useTrips";

export function PaymentCancelView() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  const { data: trip } = useTrip(tripId || "");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      {/* Cancelled Banner */}
      <div className="rounded-3xl border-2 border-amber-400 bg-amber-50/70 p-6 sm:p-8 text-center space-y-3 shadow-xs">
        <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-300">
            Transaction Interrupted
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            Payment Was Not Completed
          </h1>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            Your emergency ambulance payment session was cancelled or timed out.
            No amount has been deducted from your bKash account.
          </p>
        </div>
      </div>

      {/* Assistance & Retry Options */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <span>Need Help Settling Emergency Charges?</span>
        </h3>
        <p className="text-xs text-stone-500">
          You can retry the online settlement anytime directly through bKash
          Merchant Gateway from your trip history.
        </p>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
          <div>
            <span className="text-stone-400 font-bold text-[10px] uppercase block">
              24/7 Billing Support
            </span>
            <span className="font-bold text-stone-900">+880 9612-999999</span>
          </div>
          <a
            href="tel:+8809612999999"
            className="h-8 px-3 rounded-xl bg-stone-200 text-stone-800 font-bold inline-flex items-center gap-1.5 hover:bg-stone-300 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call Support</span>
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {trip && (
          <Button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="w-full sm:w-auto h-11 px-6 text-xs font-black bg-[#E2136E] hover:bg-[#C90E60] text-white gap-2 shadow-md cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>RETRY PAYMENT WITH BKASH</span>
          </Button>
        )}

        <Link
          href="/dashboard/trips"
          className="inline-flex items-center justify-center w-full sm:w-auto h-11 px-5 rounded-xl border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 font-bold text-xs gap-2 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Trip History</span>
        </Link>
      </div>

      {/* Checkout Modal if Retry is clicked */}
      {trip && (
        <PaymentCheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          trip={trip}
        />
      )}
    </div>
  );
}
