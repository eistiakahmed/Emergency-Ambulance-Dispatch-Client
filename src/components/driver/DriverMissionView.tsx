"use client";

import { Ambulance, Radio } from "lucide-react";
import Link from "next/link";
import { TripMilestoneStepper } from "@/components/driver/TripMilestoneStepper";
import { Button } from "@/components/ui/button";
import { useMyVehicle } from "@/lib/hooks/useAmbulances";
import { useActiveTrip } from "@/lib/hooks/useTrips";

export function DriverMissionView() {
  const { data: activeTrip, isLoading: loadingTrip } = useActiveTrip();
  const { data: vehicle } = useMyVehicle();

  return (
    <div className="space-y-6">
      {/* 1. Mission Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold">
            <Ambulance className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Active Emergency Mission
            </h2>
            <p className="text-xs text-stone-500">
              Assigned Vehicle:{" "}
              <span className="font-mono font-bold text-stone-700">
                {vehicle?.plateNumber || vehicle?.vehicleNumber || "EMS-901"}
              </span>{" "}
              • Type: {vehicle?.type || "ALS Critical Unit"}
            </p>
          </div>
        </div>

        {activeTrip ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold shrink-0">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <span>Mission In Progress</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Standby (Ready for Dispatch)</span>
          </div>
        )}
      </div>

      {/* 2. Active Mission Stepper or Standby Radar */}
      {activeTrip ? (
        <TripMilestoneStepper trip={activeTrip} />
      ) : (
        <div className="rounded-3xl border border-dashed border-stone-200 bg-white p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
            <Radio className="h-7 w-7 animate-pulse" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-stone-900">
              No Active Emergency Mission Assigned
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your ambulance is broadcasting active GPS telemetry to Central
              Dispatch. When a nearby 999 emergency call is routed to your
              vehicle, the interactive waypoint navigation will automatically
              appear here.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/provider">
              <Button variant="outline" size="sm" className="font-bold text-xs">
                Back to Driver Cockpit
              </Button>
            </Link>
            <Link href="/provider/history">
              <Button variant="ghost" size="sm" className="font-bold text-xs">
                View Past Completed Trips
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
