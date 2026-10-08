"use client";

import {
  Ambulance as AmbulanceIcon,
  Clock,
  Radio,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DriverShiftToggle } from "@/components/driver/DriverShiftToggle";
import { IncomingEmergencyAlert } from "@/components/driver/IncomingEmergencyAlert";
import { TripMilestoneStepper } from "@/components/driver/TripMilestoneStepper";
import { useMyVehicle } from "@/lib/hooks/useAmbulances";
import { useEmergencies } from "@/lib/hooks/useEmergencies";
import { useActiveTrip, useTrips } from "@/lib/hooks/useTrips";

export function DriverConsole() {
  const { data: vehicle, isLoading: loadingVehicle } = useMyVehicle();
  const { data: activeTrip, isLoading: loadingTrip } = useActiveTrip();
  const { data: pendingEmergenciesData } = useEmergencies({
    status: "PENDING",
    limit: 1,
  });
  const { data: tripsData } = useTrips({ limit: 5 });

  const [dismissedEmergencyId, setDismissedEmergencyId] = useState<
    string | null
  >(null);

  const pendingEmergencies = Array.isArray(pendingEmergenciesData)
    ? pendingEmergenciesData
    : pendingEmergenciesData?.data || [];
  const pendingEmergency = pendingEmergencies[0];

  const showIncomingAlert =
    Boolean(pendingEmergency) &&
    pendingEmergency?.id !== dismissedEmergencyId &&
    !activeTrip &&
    vehicle?.status === "AVAILABLE";

  const trips = Array.isArray(tripsData) ? tripsData : tripsData?.data || [];
  const completedTripsCount =
    trips.filter((t) => t.status === "COMPLETED").length || 0;

  const isOnDuty =
    vehicle?.status === "AVAILABLE" ||
    vehicle?.status === "BUSY" ||
    vehicle?.status === "ON_TRIP";

  return (
    <div className="space-y-6">
      {/* Standard Header Bar */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Driver Operational Cockpit
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Shift status telemetry, live GPS beacon broadcasting, and emergency
          mission execution.
        </p>
      </div>

      {/* 1. Driver Shift Header & GPS Telemetry */}
      <DriverShiftToggle />

      {/* 2. Incoming Live Emergency Dispatch Alert */}
      {showIncomingAlert && pendingEmergency && (
        <IncomingEmergencyAlert
          emergency={pendingEmergency}
          onDecline={() => setDismissedEmergencyId(pendingEmergency.id)}
        />
      )}

      {/* 3. Active Mission Stepper / Workbench */}
      {activeTrip ? (
        <TripMilestoneStepper trip={activeTrip} />
      ) : (
        <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-stone-200 bg-white text-center space-y-3 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-900">
              Scanning Dispatch Radar for Emergency Calls
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Vehicle is connected to the centralized 999 dispatch network.
              Incoming SOS calls will appear here automatically.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Link
              href="/provider/mission"
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <AmbulanceIcon className="h-3.5 w-3.5" />
              <span>Active Mission Cockpit</span>
            </Link>
            <Link
              href="/provider/history"
              className="text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Shift History</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Driver Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Completed Missions"
          value={completedTripsCount}
          description="Successful medical transfers"
          icon={ShieldCheck}
          variant="emerald"
        />
        <StatCard
          title="Shift Availability"
          value={isOnDuty ? "On Duty" : "Off Duty"}
          description={
            isOnDuty ? "Broadcasting live GPS to dispatch" : "Driver offline"
          }
          icon={Clock}
          variant={isOnDuty ? "emerald" : "stone"}
        />
        <StatCard
          title="Assigned Vehicle"
          value={
            vehicle?.vehicleNumber ||
            (loadingVehicle ? "Loading..." : "Unassigned")
          }
          description={
            vehicle?.type
              ? vehicle.type.replace(/_/g, " ")
              : loadingVehicle
                ? "Fetching fleet..."
                : "No vehicle assigned yet"
          }
          icon={AmbulanceIcon}
          variant={vehicle ? "red" : "stone"}
          loading={loadingVehicle}
        />
      </div>
    </div>
  );
}
