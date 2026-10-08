"use client";

import {
  Activity,
  Ambulance as AmbulanceIcon,
  ArrowRight,
  Clock,
  Hospital as HospitalIcon,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Siren,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { useEmergencies } from "@/lib/hooks/useEmergencies";
import { useHospitals } from "@/lib/hooks/useHospitals";
import { useActiveTrip } from "@/lib/hooks/useTrips";
import { useAppSelector } from "@/store/hooks";
import type { Emergency, Hospital } from "@/types";

export function PatientOverview() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: activeTrip, isLoading: loadingTrip } = useActiveTrip();
  const { data: emergenciesData, isLoading: loadingEmergencies } =
    useEmergencies({
      limit: 5,
    });
  const { data: hospitalsData } = useHospitals({ limit: 4 });

  const emergencies = Array.isArray(emergenciesData)
    ? (emergenciesData as Emergency[])
    : emergenciesData?.data || [];
  const hospitals = Array.isArray(hospitalsData)
    ? (hospitalsData as Hospital[])
    : hospitalsData?.data || [];

  return (
    <div className="space-y-6">
      {/* 1. Emergency SOS Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 shadow-lg shadow-red-600/15">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-red-100 border border-white/20">
              <ShieldAlert className="h-3.5 w-3.5 text-white" />
              <span>Priority Medical Emergency Hotline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need Immediate Emergency Help,{" "}
              {user?.name?.split(" ")[0] || "Citizen"}?
            </h1>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
              Broadcast high-priority emergency SOS to the nearest available ICU
              ambulances and discover real-time hospital bed availability across
              the network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <Link href="/dashboard/emergency/new" className="w-full sm:w-auto">
              <Button
                variant="warm"
                size="lg"
                className="w-full sm:w-auto gap-2 text-stone-900 bg-white hover:bg-stone-100 font-black shadow-md"
              >
                <Siren className="h-5 w-5 text-red-600" />
                <span>REQUEST INSTANT SOS</span>
              </Button>
            </Link>

            <a href="tel:999" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-13 px-7 rounded-xl bg-red hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-md border border-white transition-all active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="h-4.5 w-4.5 text-red-400 shrink-0" />
                <span>CALL 999 HOTLINE</span>
              </button>
            </a>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Active In-Progress Trip Tracker (If Active) */}
      {activeTrip && (
        <div className="rounded-2xl border-2 border-red-500 bg-white p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200">
                <AmbulanceIcon className="h-6 w-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-stone-900">
                    Active Emergency Dispatch in Progress
                  </h3>
                  <StatusBadge status={activeTrip.status} size="sm" />
                </div>
                <p className="text-xs text-stone-500 font-mono">
                  Trip Reference #{activeTrip.id.slice(0, 8)} • Dispatched:{" "}
                  {new Date(activeTrip.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <Link href={`/dashboard/trips/${activeTrip.id}`}>
              <Button
                variant="emergency"
                size="sm"
                className="font-bold text-xs gap-1.5"
              >
                <span>View Live Tracker</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-bold uppercase text-[10px]">
                Pickup Location
              </span>
              <p className="font-semibold text-stone-900 flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
                {activeTrip.emergencyRequest?.pickupAddress ||
                  "Specified Pickup Address"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-bold uppercase text-[10px]">
                Vehicle / Driver
              </span>
              <p className="font-semibold text-stone-900 flex items-center gap-1.5 truncate">
                <AmbulanceIcon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                {activeTrip.ambulance?.vehicleNumber || "Assigned Ambulance"} (
                {activeTrip.ambulance?.type || "ALS"})
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-bold uppercase text-[10px]">
                Assigned Hospital Destination
              </span>
              <p className="font-semibold text-stone-900 flex items-center gap-1.5 truncate">
                <HospitalIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                {activeTrip.emergencyRequest?.destinationHospital?.name ||
                  "Nearest Emergency Room"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total SOS Requests"
          value={emergencies.length}
          description="Logged medical incidents"
          icon={Siren}
          variant="red"
          loading={loadingEmergencies}
        />
        <StatCard
          title="Active Care Status"
          value={activeTrip ? "Active Mission" : "Standby"}
          description={
            activeTrip ? "Ambulance dispatched" : "No ongoing medical transit"
          }
          icon={Clock}
          variant={activeTrip ? "red" : "emerald"}
          loading={loadingTrip}
        />
        <StatCard
          title="Available ICU Beds"
          value={hospitals.reduce(
            (acc: number, h: Hospital) =>
              acc + (h.availableIcuBeds ?? h.icuBedsAvailable ?? 0),
            0,
          )}
          description={`${hospitals.length} partner hospital networks`}
          icon={Activity}
          variant="blue"
        />
        <StatCard
          title="EMS Dispatch Radar"
          value="24/7 Live"
          description="Real-time triage & GPS routing"
          icon={AmbulanceIcon}
          variant="stone"
        />
      </div>

      {/* 4. Two Column Content: Recent SOS Calls & Bed Discovery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Emergencies */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span>Recent Emergency Requests</span>
            </h2>
            <Link
              href="/dashboard/trips"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {emergencies.length === 0 && !loadingEmergencies ? (
            <EmptyState
              icon={Siren}
              title="No Past Emergency Incidents"
              description="Your emergency call history is completely clean. In case of an emergency, use the SOS button above."
              actionLabel="Request SOS Ambulance"
              onAction={() =>
                window.location.assign("/dashboard/emergency/new")
              }
            />
          ) : (
            <div className="space-y-2.5">
              {emergencies.slice(0, 4).map((em: Emergency) => (
                <div
                  key={em.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {em.emergencyType} Emergency
                      </span>
                      <StatusBadge status={em.status} size="sm" />
                    </div>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
                      <span className="truncate max-w-sm">
                        {em.pickupAddress}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-500 shrink-0">
                    <span className="font-mono text-[11px]">
                      {new Date(em.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/dashboard/trips`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs font-bold px-2.5"
                      >
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Nearby Hospitals & Bed Availability */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <HospitalIcon className="h-4 w-4 text-emerald-600" />
              <span>Available Hospital Beds</span>
            </h2>
            <Link
              href="/hospitals"
              className="text-xs font-bold text-stone-600 hover:text-stone-900"
            >
              Explore
            </Link>
          </div>

          <div className="space-y-2.5">
            {hospitals.map((h: Hospital) => (
              <div
                key={h.id}
                className="p-3.5 rounded-2xl border border-stone-200 bg-white space-y-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {h.name}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {h.availableIcuBeds} ICU Free
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
                  {h.address}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[10px] font-semibold text-stone-600">
                  <span>General Beds: {h.availableGeneralBeds} Available</span>
                  <a
                    href={`tel:${h.contactNumber || "999"}`}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Direct Line
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
