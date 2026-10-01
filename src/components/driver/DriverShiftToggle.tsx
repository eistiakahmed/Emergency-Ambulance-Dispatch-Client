"use client";

import React, { useState } from "react";
import {
  Power,
  Radio,
  Navigation,
  Loader2,
  Ambulance as AmbulanceIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyVehicle, useUpdateDriverStatus } from "@/lib/hooks/useAmbulances";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function DriverShiftToggle() {
  const { data: vehicle, isLoading } = useMyVehicle();
  const updateStatusMutation = useUpdateDriverStatus();
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const isOnline = vehicle?.status === "AVAILABLE";
  const isOnTrip = vehicle?.status === "ON_TRIP" || vehicle?.status === "BUSY";

  const handleToggleShift = async () => {
    if (isOnTrip) {
      toast.error("Cannot go offline while on an active trip!");
      return;
    }

    const nextStatus = isOnline ? "OFFLINE" : "AVAILABLE";
    await updateStatusMutation.mutateAsync({
      status: nextStatus,
    });
  };

  const handleBroadcastGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not available");
      return;
    }

    setUpdatingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await updateStatusMutation.mutateAsync({
            status: vehicle?.status || "AVAILABLE",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          toast.success("GPS Location Synced to Dispatch Radar", {
            description: `Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          });
        } finally {
          setUpdatingLocation(false);
        }
      },
      (err) => {
        setUpdatingLocation(false);
        toast.error("Location Fetch Error", { description: err.message });
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Vehicle & Duty Status */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors shadow-2xs",
              isOnline
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : isOnTrip
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-stone-100 text-stone-400 border-stone-200"
            )}
          >
            <AmbulanceIcon className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900">
                {vehicle?.vehicleNumber || "EMS-UNIT-901"}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : isOnTrip
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-stone-100 text-stone-600 border-stone-200"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isOnline
                      ? "bg-emerald-500 animate-ping"
                      : isOnTrip
                      ? "bg-blue-500 animate-ping"
                      : "bg-stone-400"
                  )}
                />
                <span>
                  {isOnline ? "ON DUTY (READY)" : isOnTrip ? "ON ACTIVE CALL" : "OFF DUTY"}
                </span>
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-0.5">
              Type: <strong>{vehicle?.type || "ALS (Advanced Life Support)"}</strong> • Model:{" "}
              {vehicle?.model || "Mercedes Sprinter"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBroadcastGPS}
            disabled={updatingLocation || !isOnline}
            className="h-9 px-3 text-xs font-bold gap-1.5"
          >
            {updatingLocation ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" />
            ) : (
              <Navigation className="h-3.5 w-3.5 text-blue-600" />
            )}
            <span>Update GPS</span>
          </Button>

          <Button
            type="button"
            variant={isOnline ? "destructive" : "default"}
            size="sm"
            disabled={updateStatusMutation.isPending || isOnTrip}
            onClick={handleToggleShift}
            className={cn(
              "h-9 px-4 text-xs font-bold gap-1.5",
              !isOnline && "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            {updateStatusMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Power className="h-3.5 w-3.5" />
            )}
            <span>{isOnline ? "Go Offline" : "Go Online (Start Shift)"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
