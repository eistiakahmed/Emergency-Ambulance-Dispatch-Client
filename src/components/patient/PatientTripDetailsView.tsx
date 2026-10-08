"use client";

import {
  ArrowLeft,
  Hospital as HospitalIcon,
  MapPin,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PaymentCheckoutModal } from "@/components/patient/PaymentCheckoutModal";
import { BkashIcon } from "@/components/ui/BkashLogo";
import { Button } from "@/components/ui/button";
import { useTrip } from "@/lib/hooks/useTrips";

export function PatientTripDetailsView({ id }: { id: string }) {
  const { data: trip, isLoading } = useTrip(id);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto py-8">
        <div className="h-8 w-48 rounded-lg bg-stone-200 animate-pulse" />
        <div className="h-96 rounded-3xl bg-stone-100 animate-pulse" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-lg font-black text-stone-900">
          Trip Record Not Found
        </h2>
        <p className="text-xs text-stone-500">
          The requested emergency ambulance trip could not be located.
        </p>
        <Link
          href="/dashboard/trips"
          className="inline-flex items-center justify-center h-8 px-3 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 font-bold text-xs shadow-2xs"
        >
          Return to Trips
        </Link>
      </div>
    );
  }

  const isCompleted = trip.status === "COMPLETED";
  const isPaid =
    trip.payment?.status === "SUCCEEDED" || trip.payment?.status === "PAID";
  const rawFare = Number(trip.totalFare || trip.baseFare || 1500);
  const bdtFare =
    rawFare > 500
      ? Math.round(rawFare)
      : Math.max(10, Math.round(rawFare * 120));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/trips"
              className="inline-flex items-center h-7 px-2 font-bold text-xs gap-1 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-mono font-bold text-stone-500 uppercase">
              Mission #{trip.id.slice(0, 8)}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
            Emergency Dispatch Summary
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={trip.status} />
        </div>
      </div>

      {/* Main Status & Route Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-6">
        {/* Incident Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
              Pickup Point
            </span>
            <p className="font-bold text-stone-900 text-sm">
              {trip.emergencyRequest?.patientName || "Emergency Patient"}
            </p>
            <p className="text-stone-600 flex items-start gap-1">
              <MapPin className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{trip.emergencyRequest?.pickupAddress}</span>
            </p>
            <p className="text-[11px] text-stone-500 font-mono">
              Phone: {trip.emergencyRequest?.patientPhone || "+880 1700-000000"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
              Designated ER Hospital
            </span>
            <p className="font-bold text-stone-900 text-sm">
              {trip.emergencyRequest?.destinationHospital?.name ||
                "Emergency Care Hospital"}
            </p>
            <p className="text-stone-600 flex items-start gap-1">
              <HospitalIcon className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {trip.emergencyRequest?.destinationHospital?.address ||
                  "Level 1 Trauma ER Wing"}
              </span>
            </p>
            <p className="text-[11px] text-stone-500 font-mono">
              Ambulance: {trip.ambulance?.vehicleNumber} ({trip.ambulance?.type}
              )
            </p>
          </div>
        </div>

        {/* Fare & Payment Card */}
        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                Transit Billing Statement
              </span>
              <p className="font-black text-stone-900 text-base">
                ৳{bdtFare.toLocaleString()} BDT
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                Payment Status
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase border ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : isCompleted
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-stone-100 text-stone-600 border-stone-200"
                }`}
              >
                {isPaid
                  ? "PAID / SETTLED"
                  : isCompleted
                    ? "PAYMENT REQUIRED"
                    : "ESTIMATED"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-xs text-stone-500">
              {isPaid
                ? "Payment has been settled via digital gateway. Digital receipt is archived."
                : isCompleted
                  ? "This emergency trip is completed. Please settle the transit fare using bKash Merchant Gateway."
                  : "Active ambulance transit in progress. Final fare will be calculated upon arrival."}
            </p>

            {isCompleted && !isPaid && (
              <Button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="w-full sm:w-auto h-10 px-5 text-xs font-black bg-[#E2136E] hover:bg-[#C90E60] text-white shadow-md gap-2 shrink-0 cursor-pointer"
              >
                <BkashIcon className="h-4 w-4" />
                <span>PAY ৳{bdtFare.toLocaleString()} WITH BKASH</span>
              </Button>
            )}

            {isPaid && (
              <Link
                href={`/payments/success?tripId=${trip.id}`}
                className="inline-flex items-center justify-center w-full sm:w-auto h-10 px-4 text-xs font-bold text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-50 gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                <Receipt className="h-4 w-4" />
                <span>View Official Receipt</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        trip={trip}
      />
    </div>
  );
}
