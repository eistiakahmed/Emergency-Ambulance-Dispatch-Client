"use client";

import { Building2, ExternalLink, Loader2, MapPin } from "lucide-react";
import { BkashIcon } from "@/components/ui/BkashLogo";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useInitiateBkashPayment } from "@/lib/hooks/usePayments";
import type { Trip } from "@/types";

export interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export function PaymentCheckoutModal({
  isOpen,
  onClose,
  trip,
}: PaymentCheckoutModalProps) {
  const initiateBkashMutation = useInitiateBkashPayment();

  const rawFare = Number(trip.totalFare || trip.baseFare || 1500);
  const bdtFare =
    rawFare > 500
      ? Math.round(rawFare)
      : Math.max(10, Math.round(rawFare * 120));

  const handlePayWithBkash = async () => {
    const callbackURL = `${window.location.origin}/payments/success?tripId=${trip.id}`;
    const res: any = await initiateBkashMutation.mutateAsync({
      tripId: trip.id,
      payerReference: trip.emergencyRequest?.patientPhone || "01700000000",
      callbackURL,
    });
    const data = res?.data || res;
    if (data?.bkashURL) {
      window.location.assign(data.bkashURL);
    }
  };

  const isPending = initiateBkashMutation.isPending;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="bKash Payment"
      description="Emergency ambulance trip fare checkout"
    >
      <div className="space-y-5 pt-2 text-center">
        {/* bKash Icon & Amount Hero */}
        <div className="rounded-3xl bg-[#FFF0F6] border border-[#E2136E]/20 p-6 space-y-3">
          <BkashIcon className="h-16 w-16 mx-auto shadow-lg" />

          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Total Amount Payable
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              ৳{bdtFare.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Minimal Trip Details */}
        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 text-left text-xs space-y-2">
          <div className="flex items-start gap-2 text-stone-700">
            <Building2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Hospital
              </span>
              <p className="font-semibold text-stone-900 truncate">
                {trip.emergencyRequest?.destinationHospital?.name ||
                  "Designated Emergency ER Hospital"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-stone-700 pt-1.5 border-t border-stone-200/60">
            <MapPin className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Pickup Address
              </span>
              <p className="font-semibold text-stone-900 truncate">
                {trip.emergencyRequest?.pickupAddress ||
                  "Emergency Pickup Location"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isPending}
            className="font-bold text-xs h-11 px-4"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handlePayWithBkash}
            disabled={isPending}
            className="flex-1 h-11 text-xs font-black tracking-wide bg-[#E2136E] hover:bg-[#C90E60] text-white shadow-md gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>CONNECTING BKASH...</span>
              </>
            ) : (
              <>
                <span>PAY ৳{bdtFare.toLocaleString()} WITH BKASH</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
