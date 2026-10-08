"use client";

import { Check, Loader2, MapPin, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyVehicle } from "@/lib/hooks/useAmbulances";
import { useCreateTrip } from "@/lib/hooks/useTrips";
import type { EmergencyRequest } from "@/types";

export interface IncomingEmergencyAlertProps {
  emergency: EmergencyRequest;
  onDecline?: () => void;
}

export function IncomingEmergencyAlert({
  emergency,
  onDecline,
}: IncomingEmergencyAlertProps) {
  const { data: vehicle } = useMyVehicle();
  const createTripMutation = useCreateTrip();

  const handleAccept = async () => {
    if (!vehicle?.id) return;
    await createTripMutation.mutateAsync({
      emergencyRequestId: emergency.id,
      ambulanceId: vehicle.id,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-red-500 bg-red-50/50 p-5 shadow-md space-y-4 animate-in slide-in-from-top-3 duration-300">
      {/* Top Banner Alert */}
      <div className="flex items-center justify-between gap-3 border-b border-red-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
          </span>
          <h4 className="text-sm font-black tracking-tight text-red-900 uppercase">
            🚨 INCOMING DISPATCH CALL • {emergency.emergencyType}
          </h4>
        </div>

        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
          {emergency.severityLevel || "CRITICAL"}
        </span>
      </div>

      {/* Emergency Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-red-100 space-y-1">
          <span className="text-stone-500 font-bold uppercase text-[10px]">
            Patient Name & Contact
          </span>
          <p className="font-bold text-stone-900">{emergency.patientName}</p>
          <a
            href={`tel:${emergency.patientPhone}`}
            className="text-red-600 font-semibold flex items-center gap-1 hover:underline"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{emergency.patientPhone}</span>
          </a>
        </div>

        <div className="p-3 rounded-xl bg-white border border-red-100 space-y-1">
          <span className="text-stone-500 font-bold uppercase text-[10px]">
            Pickup Street Location
          </span>
          <p className="font-bold text-stone-900 flex items-start gap-1">
            <MapPin className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{emergency.pickupAddress}</span>
          </p>
        </div>
      </div>

      {/* Medical Notes if Present */}
      {emergency.notes && (
        <div className="p-3 rounded-xl bg-white/80 border border-stone-200 text-xs space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-stone-500">
            Triage Symptoms / Notes:
          </span>
          <p className="text-stone-700 italic">{emergency.notes}</p>
        </div>
      )}

      {/* Dispatch Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="emergency"
          size="lg"
          onClick={handleAccept}
          disabled={createTripMutation.isPending || !vehicle?.id}
          className="flex-1 h-11 text-xs font-black tracking-wide shadow-md gap-2"
        >
          {createTripMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span>ACCEPT DISPATCH & ENGAGE SIREN</span>
        </Button>

        {onDecline && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onDecline}
            disabled={createTripMutation.isPending}
            className="h-11 px-4 text-xs font-bold text-stone-600 hover:text-red-600"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Decline</span>
          </Button>
        )}
      </div>
    </div>
  );
}
