"use client";

import {
  Ambulance as AmbulanceIcon,
  Check,
  Loader2,
  MapPin,
  Siren,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAmbulances } from "@/lib/hooks/useAmbulances";
import { useCreateTrip } from "@/lib/hooks/useTrips";
import { cn } from "@/lib/utils";
import type { Ambulance, EmergencyRequest } from "@/types";

export interface AssignAmbulanceDialogProps {
  emergency: EmergencyRequest | null;
  onClose: () => void;
}

export function AssignAmbulanceDialog({
  emergency,
  onClose,
}: AssignAmbulanceDialogProps) {
  const { data: ambulancesData, isLoading: loadingFleet } = useAmbulances({
    status: "AVAILABLE",
    limit: 10,
  });
  const createTripMutation = useCreateTrip();

  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>("");

  const availableAmbulances: Ambulance[] = Array.isArray(ambulancesData)
    ? (ambulancesData as Ambulance[])
    : ambulancesData?.data || [];

  const handleDispatch = async () => {
    if (!emergency || !selectedAmbulanceId) {
      toast.error("Please select an available ambulance");
      return;
    }

    await createTripMutation.mutateAsync({
      emergencyRequestId: emergency.id,
      ambulanceId: selectedAmbulanceId,
    });
    onClose();
  };

  if (!emergency) return null;

  return (
    <Dialog
      isOpen={Boolean(emergency)}
      onClose={onClose}
      title={`Dispatch Ambulance for ${emergency.emergencyType} Emergency`}
      description={`Incident #${emergency.id.slice(0, 8)} • Patient: ${emergency.patientName} (${emergency.patientPhone})`}
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Incident Summary Card */}
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-red-700">
              Pickup Point
            </span>
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold">
              {emergency.severityLevel || "CRITICAL"}
            </span>
          </div>
          <p className="font-bold text-stone-900 flex items-start gap-1">
            <MapPin className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{emergency.pickupAddress}</span>
          </p>
        </div>

        {/* Available Fleet Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-stone-800">
              Select Available Ambulance Vehicle
            </label>
            <span className="text-stone-500 font-mono text-[11px]">
              {availableAmbulances.length} units online
            </span>
          </div>

          {availableAmbulances.length === 0 && !loadingFleet ? (
            <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 text-amber-900 text-center space-y-1">
              <p className="font-bold">No Ambulances Currently Available</p>
              <p className="text-[11px] text-amber-700">
                All fleet vehicles are on active duty or offline. Wait for a
                unit to complete.
              </p>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {availableAmbulances.map((amb) => {
                const isSelected = selectedAmbulanceId === amb.id;

                return (
                  <button
                    key={amb.id}
                    type="button"
                    onClick={() => setSelectedAmbulanceId(amb.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-red-600 bg-red-50/80 ring-2 ring-red-500/20 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-stone-50/40",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-800 shrink-0">
                        <AmbulanceIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">
                          {amb.plateNumber || amb.vehicleNumber || "EMS Unit"}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Type: {amb.type} • Driver:{" "}
                          {amb.driver?.name || "Assigned Driver"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        Ready
                      </span>
                      {isSelected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="font-bold text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="emergency"
            size="sm"
            disabled={!selectedAmbulanceId || createTripMutation.isPending}
            onClick={handleDispatch}
            className="font-bold text-xs gap-1.5 shadow-xs"
          >
            {createTripMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Siren className="h-3.5 w-3.5" />
            )}
            <span>CONFIRM & DISPATCH AMBULANCE</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
