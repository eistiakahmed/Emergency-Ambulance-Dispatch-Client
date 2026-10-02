"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Navigation,
  UserCheck,
  Hospital as HospitalIcon,
  Flag,
  Loader2,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useUpdateTripStatus } from "@/lib/hooks/useTrips";
import type { Trip, TripStatus } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MILESTONES: {
  status: TripStatus;
  label: string;
  shortDesc: string;
  nextLabel: string;
  nextStatus?: TripStatus;
  icon: typeof Navigation;
}[] = [
  {
    status: "ASSIGNED",
    label: "Ambulance Dispatched",
    shortDesc: "Crew assigned and en route to base",
    nextLabel: "Start Navigation to Patient Pickup",
    nextStatus: "EN_ROUTE_PICKUP",
    icon: Navigation,
  },
  {
    status: "EN_ROUTE_PICKUP",
    label: "En Route to Pickup",
    shortDesc: "Vehicle travelling to patient coordinates",
    nextLabel: "Confirm Patient Onboard (Vitals Stable)",
    nextStatus: "PATIENT_PICKED_UP",
    icon: UserCheck,
  },
  {
    status: "PATIENT_PICKED_UP",
    label: "Patient Onboard",
    shortDesc: "Vitals stabilized, transporting to hospital",
    nextLabel: "Arrived at Emergency Trauma ER",
    nextStatus: "ARRIVED_HOSPITAL",
    icon: HospitalIcon,
  },
  {
    status: "ARRIVED_HOSPITAL",
    label: "At Hospital Destination",
    shortDesc: "Transferring patient to emergency intake team",
    nextLabel: "Complete & Finalize Mission",
    nextStatus: "COMPLETED",
    icon: Flag,
  },
];

export function TripMilestoneStepper({ trip }: { trip: Trip }) {
  const updateStatusMutation = useUpdateTripStatus();

  const currentIndex = MILESTONES.findIndex((m) => m.status === trip.status);
  const currentMilestone = MILESTONES[currentIndex] || MILESTONES[0];
  const isFinished = trip.status === "COMPLETED" || trip.status === "CANCELLED";

  const handleAdvanceMilestone = async () => {
    if (!currentMilestone.nextStatus) return;

    await updateStatusMutation.mutateAsync({
      id: trip.id,
      payload: {
        status: currentMilestone.nextStatus,
      },
    });
  };

  return (
    <div className="rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-md space-y-6">
      {/* Active Trip Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-stone-500 uppercase">
              Live Mission #{trip.id.slice(0, 8)}
            </span>
            <StatusBadge status={trip.status} size="sm" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900">
            Emergency Dispatch Workbench
          </h2>
        </div>

        <div className="text-left sm:text-right text-xs">
          <span className="text-stone-500 font-semibold">Priority Triage</span>
          <p className="font-bold text-red-600 uppercase">
            {trip.emergencyRequest?.emergencyType || "Critical Emergency"}
          </p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {MILESTONES.map((m, idx) => {
          const isPassed = currentIndex > idx || isFinished;
          const isCurrent = currentIndex === idx && !isFinished;
          const StepIcon = m.icon;

          return (
            <div
              key={m.status}
              className={cn(
                "p-3 rounded-2xl border transition-all text-left space-y-1.5",
                isCurrent
                  ? "border-red-600 bg-red-50/70 ring-2 ring-red-500/20 shadow-xs"
                  : isPassed
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-stone-200 bg-stone-50/40 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black",
                    isPassed
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-red-600 text-white"
                      : "bg-stone-200 text-stone-600"
                  )}
                >
                  {isPassed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </span>

                <StepIcon
                  className={cn(
                    "h-4 w-4",
                    isCurrent ? "text-red-600" : isPassed ? "text-emerald-600" : "text-stone-400"
                  )}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-stone-900 leading-tight">
                  {m.label}
                </p>
                <p className="text-[10px] text-stone-500 leading-tight truncate mt-0.5">
                  {m.shortDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient & Hospital Location Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
              Pickup Point
            </span>
            <a
              href={`tel:${trip.emergencyRequest?.patientPhone || "999"}`}
              className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Patient</span>
            </a>
          </div>
          <p className="font-bold text-stone-900 text-sm">
            {trip.emergencyRequest?.patientName || "Emergency Patient"}
          </p>
          <p className="text-stone-600 flex items-start gap-1">
            <MapPin className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{trip.emergencyRequest?.pickupAddress}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
            Designated Hospital
          </span>
          <p className="font-bold text-stone-900 text-sm">
            {trip.emergencyRequest?.destinationHospital?.name || "Nearest Emergency Hospital"}
          </p>
          <p className="text-stone-600 flex items-start gap-1">
            <HospitalIcon className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              {trip.emergencyRequest?.destinationHospital?.address ||
                "Emergency Medical Wing, Level 1"}
            </span>
          </p>
        </div>
      </div>

      {/* Advance Action Trigger */}
      {!isFinished && currentMilestone && (
        <div className="pt-2">
          <Button
            type="button"
            variant="emergency"
            size="lg"
            disabled={updateStatusMutation.isPending}
            onClick={handleAdvanceMilestone}
            className="w-full h-12 text-sm font-black tracking-wide shadow-md gap-2"
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>UPDATING TRIP STATE...</span>
              </>
            ) : (
              <>
                <span>ADVANCE STATUS: {currentMilestone.nextLabel.toUpperCase()}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {isFinished && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>This emergency mission is marked as COMPLETED. Vehicle is ready for new calls.</span>
        </div>
      )}
    </div>
  );
}
