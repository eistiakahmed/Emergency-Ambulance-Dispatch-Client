"use client";

import React, { useState } from "react";
import {
  Siren,
  Ambulance as AmbulanceIcon,
  Clock,
  ShieldCheck,
  Radio,
  MapPin,
  ListOrdered,
} from "lucide-react";
import { DriverShiftToggle } from "@/components/driver/DriverShiftToggle";
import { IncomingEmergencyAlert } from "@/components/driver/IncomingEmergencyAlert";
import { TripMilestoneStepper } from "@/components/driver/TripMilestoneStepper";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useActiveTrip, useTrips } from "@/lib/hooks/useTrips";
import { useEmergencies } from "@/lib/hooks/useEmergencies";
import { useMyVehicle } from "@/lib/hooks/useAmbulances";

export function DriverConsole() {
  const { data: vehicle, isLoading: loadingVehicle } = useMyVehicle();
  const { data: activeTrip, isLoading: loadingTrip } = useActiveTrip();
  const { data: pendingEmergenciesData } = useEmergencies({
    status: "PENDING",
    limit: 1,
  });
  const { data: tripsData } = useTrips({ limit: 5 });

  const [dismissedEmergencyId, setDismissedEmergencyId] = useState<string | null>(
    null
  );

  const pendingEmergency = pendingEmergenciesData?.data?.[0];
  const showIncomingAlert =
    Boolean(pendingEmergency) &&
    pendingEmergency?.id !== dismissedEmergencyId &&
    !activeTrip &&
    vehicle?.status === "AVAILABLE";

  const completedTripsCount =
    tripsData?.data?.filter((t) => t.status === "COMPLETED")?.length || 0;

  return (
    <div className="space-y-6">
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
        <div className="p-6 rounded-3xl border border-dashed border-stone-200 bg-white text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Scanning Dispatch Radar for Emergency Calls
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Vehicle is connected to the centralized 999 dispatch network. Incoming SOS calls
            will appear here automatically.
          </p>
        </div>
      )}

      {/* 4. Driver Daily Performance KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Completed Missions"
          value={completedTripsCount}
          description="Successful medical transfers"
          icon={ShieldCheck}
          variant="emerald"
        />
        <StatCard
          title="On-Duty Hours"
          value="6.5 hrs"
          description="Current shift duration"
          icon={Clock}
          variant="stone"
        />
        <StatCard
          title="Assigned Vehicle"
          value={vehicle?.vehicleNumber || "EMS-901"}
          description={vehicle?.type || "ALS Critical Unit"}
          icon={AmbulanceIcon}
          variant="red"
        />
      </div>
    </div>
  );
}
