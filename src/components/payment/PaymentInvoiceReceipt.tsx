"use client";

import { Ambulance, Building2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { BkashIcon } from "@/components/ui/BkashLogo";
import type { Payment, Trip } from "@/types";

export interface PaymentInvoiceReceiptProps {
  trip?: Trip | null;
  payment?: Payment | null;
  transactionId?: string | null;
}

export function PaymentInvoiceReceipt({
  trip,
  payment,
  transactionId,
}: PaymentInvoiceReceiptProps) {
  const rawFare = Number(payment?.amount || trip?.totalFare || 1500);
  const isBdt = payment?.currency === "BDT" || rawFare > 500;
  const formattedFare = isBdt
    ? `৳${Math.round(rawFare).toLocaleString()}`
    : `$${rawFare.toFixed(2)}`;

  const distance =
    trip?.distanceKm != null
      ? `${Number(trip.distanceKm).toFixed(1)} km`
      : "6.2 km";

  return (
    <div
      id="printable-receipt"
      className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0"
    >
      {/* Receipt Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm">
              +
            </div>
            <span className="font-black text-stone-900 text-base tracking-tight">
              Emergency Dispatch Healthcare System
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            National Emergency Transit & ICU Bed Discovery Network
          </p>
        </div>

        <div className="text-left sm:text-right space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
            Official Tax Invoice
          </span>
          <p className="font-mono font-bold text-xs text-stone-900">
            TRX:{" "}
            {payment?.transactionId ||
              payment?.stripeSessionId ||
              transactionId ||
              "TX-BKASH-8829"}
          </p>
          <p className="text-[10px] text-stone-500">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Patient & Incident Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <span className="text-[10px] font-black uppercase text-stone-500 block">
            Patient / Billed To
          </span>
          <p className="font-bold text-stone-900 text-sm">
            {trip?.emergencyRequest?.patientName || "Emergency Patient"}
          </p>
          <p className="text-stone-600 text-[11px] flex items-center gap-1">
            <Phone className="h-3 w-3 text-stone-400" />
            <span>
              {trip?.emergencyRequest?.patientPhone || "+880 1700-000000"}
            </span>
          </p>
          <p className="text-stone-600 text-[11px] flex items-start gap-1 pt-1">
            <MapPin className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
            <span className="truncate">
              {trip?.emergencyRequest?.pickupAddress || "Central Dhaka"}
            </span>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <span className="text-[10px] font-black uppercase text-stone-500 block">
            Designated Hospital & Unit
          </span>
          <p className="font-bold text-stone-900 text-sm">
            {trip?.emergencyRequest?.destinationHospital?.name ||
              "Trauma Emergency Hospital"}
          </p>
          <p className="text-stone-600 text-[11px] flex items-center gap-1">
            <Ambulance className="h-3 w-3 text-stone-400" />
            <span>
              {trip?.ambulance?.vehicleNumber || "EMS-UNIT-901"} (
              {trip?.ambulance?.type || "ALS"})
            </span>
          </p>
          <p className="text-stone-600 text-[11px] flex items-center gap-1 pt-1">
            <Building2 className="h-3 w-3 text-emerald-600 shrink-0" />
            <span className="truncate">
              {trip?.emergencyRequest?.destinationHospital?.address ||
                "Level 1 Emergency ER"}
            </span>
          </p>
        </div>
      </div>

      {/* Itemized Fare Statement Table */}
      <div className="rounded-2xl border border-stone-200 overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-black uppercase text-stone-600">
              <th className="py-2.5 px-4">Item Description</th>
              <th className="py-2.5 px-4 text-center">Distance</th>
              <th className="py-2.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            <tr>
              <td className="py-3 px-4 font-medium">
                Emergency Ambulance Dispatch Base Fee
              </td>
              <td className="py-3 px-4 text-center text-stone-500">—</td>
              <td className="py-3 px-4 text-right font-mono font-bold">
                {isBdt ? "৳600" : "$5.00"}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium">
                Paramedic Transit & GPS Routing
              </td>
              <td className="py-3 px-4 text-center font-mono">{distance}</td>
              <td className="py-3 px-4 text-right font-mono font-bold">
                {isBdt
                  ? `৳${Math.max(0, rawFare - 600).toLocaleString()}`
                  : `$${Math.max(0, rawFare - 5).toFixed(2)}`}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-stone-50 border-t border-stone-200 font-bold text-stone-900">
              <td colSpan={2} className="py-3 px-4 text-sm font-black">
                Total Settled Amount
              </td>
              <td className="py-3 px-4 text-right text-base font-black text-emerald-700 font-mono">
                {formattedFare}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment Method Badge & Certification Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium">Paid via:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF0F6] text-[#E2136E] border border-[#E2136E]/20 font-black text-xs">
            <BkashIcon className="h-3.5 w-3.5" />
            <span>
              {payment?.paymentMethod === "BKASH" || isBdt
                ? "bKash Merchant Gateway"
                : "bKash Digital Payment"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Digitally Certified Receipt</span>
        </div>
      </div>
    </div>
  );
}
