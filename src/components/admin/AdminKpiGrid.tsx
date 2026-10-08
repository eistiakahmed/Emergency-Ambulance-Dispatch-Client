"use client";

import {
  Activity,
  Ambulance as AmbulanceIcon,
  Clock,
  Siren,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAmbulances } from "@/lib/hooks/useAmbulances";
import { useEmergencies } from "@/lib/hooks/useEmergencies";
import { useHospitals } from "@/lib/hooks/useHospitals";
import { useTrips } from "@/lib/hooks/useTrips";

export function AdminKpiGrid() {
  const { data: emergenciesData, isLoading: loadingEmergencies } =
    useEmergencies({
      limit: 50,
    });
  const { data: ambulancesData, isLoading: loadingAmbulances } = useAmbulances({
    limit: 50,
  });
  const { data: hospitalsData, isLoading: loadingHospitals } = useHospitals({
    limit: 50,
  });
  const { data: tripsData, isLoading: loadingTrips } = useTrips({ limit: 50 });

  const emergencies = Array.isArray(emergenciesData)
    ? emergenciesData
    : emergenciesData?.data || [];
  const ambulances = Array.isArray(ambulancesData)
    ? ambulancesData
    : ambulancesData?.data || [];
  const hospitals = Array.isArray(hospitalsData)
    ? hospitalsData
    : hospitalsData?.data || [];
  const trips = Array.isArray(tripsData) ? tripsData : tripsData?.data || [];

  const pendingEmergencies = emergencies.filter(
    (e) => e.status === "PENDING",
  ).length;
  const activeTripsCount = trips.filter(
    (t) => t.status !== "COMPLETED" && t.status !== "CANCELLED",
  ).length;

  const availableAmbulances = ambulances.filter(
    (a) => a.status === "AVAILABLE",
  ).length;
  const busyAmbulances = ambulances.filter(
    (a) => a.status === "BUSY" || a.status === "ON_TRIP",
  ).length;

  const totalIcuAvailable = hospitals.reduce(
    (acc, h) => acc + (h.availableIcuBeds || 0),
    0,
  );

  const totalFleet = ambulances.length;
  const readinessPct =
    totalFleet > 0 ? Math.round((availableAmbulances / totalFleet) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Pending SOS Calls"
        value={pendingEmergencies}
        description="Awaiting vehicle assignment"
        icon={Siren}
        variant="red"
        trend={{
          value: `${pendingEmergencies} urgent`,
          direction: pendingEmergencies > 0 ? "down" : "up",
        }}
        loading={loadingEmergencies}
      />

      <StatCard
        title="Active Fleet on Duty"
        value={
          totalFleet > 0
            ? `${availableAmbulances}/${totalFleet}`
            : `${availableAmbulances}`
        }
        description={`${busyAmbulances} units on active transport`}
        icon={AmbulanceIcon}
        variant="emerald"
        trend={
          totalFleet > 0
            ? {
                value: `${readinessPct}% ready`,
                direction: readinessPct >= 50 ? "up" : "down",
              }
            : undefined
        }
        loading={loadingAmbulances}
      />

      <StatCard
        title="Available ICU Beds"
        value={totalIcuAvailable}
        description={`${hospitals.length} certified partner hospitals`}
        icon={Activity}
        variant="blue"
        loading={loadingHospitals}
      />

      <StatCard
        title="Active Missions"
        value={activeTripsCount}
        description="Live en route dispatches"
        icon={Clock}
        variant="stone"
        loading={loadingTrips}
      />
    </div>
  );
}
