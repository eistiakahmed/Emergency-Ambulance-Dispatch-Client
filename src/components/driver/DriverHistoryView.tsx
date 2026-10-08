"use client";

import {
  Calendar,
  Clock,
  DollarSign,
  Hospital as HospitalIcon,
  MapPin,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Pagination } from "@/components/dashboard/Pagination";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useTrips } from "@/lib/hooks/useTrips";
import { formatFare } from "@/lib/utils";
import type { Trip } from "@/types";

export function DriverHistoryView() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || undefined;

  const { data: tripsData, isLoading } = useTrips({
    page,
    limit: 10,
    status,
  });

  const trips: Trip[] = Array.isArray(tripsData)
    ? (tripsData as Trip[])
    : tripsData?.data || [];
  const meta = Array.isArray(tripsData) ? undefined : tripsData?.meta;

  const completedTrips = trips.filter((t) => t.status === "COMPLETED");
  const totalCompleted = meta?.total ?? completedTrips.length;
  const totalKm = completedTrips.reduce(
    (acc, t) => acc + Number(t.distanceKm || 0),
    0,
  );
  const totalFare = completedTrips.reduce(
    (acc, t) => acc + Number(t.totalFare || 0),
    0,
  );

  const filterGroups = [
    {
      key: "status",
      label: "Mission Status",
      options: [
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Driver Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Completed Missions"
          value={totalCompleted}
          description="Successful emergency transfers"
          icon={ShieldCheck}
          variant="emerald"
        />
        <StatCard
          title="Total Distance Logged"
          value={`${Number(totalKm).toFixed(1)} km`}
          description="GPS tracked transport routing"
          icon={TrendingUp}
          variant="blue"
        />
        <StatCard
          title="Total Service Value"
          value={formatFare(totalFare, "both")}
          description="Fare & reimbursement balance"
          icon={DollarSign}
          variant="stone"
        />
      </div>

      {/* 2. Search & Filter Bar */}
      <SearchFilterBar
        placeholder="Filter by incident ref, address, or hospital..."
        filterGroups={filterGroups}
      />

      {/* 3. History Trips Table / Cards */}
      {trips.length === 0 && !isLoading ? (
        <EmptyState
          title="No Shift History Found"
          description="Completed dispatches and patient drop-offs will be archived here."
          icon={Clock}
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/75 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Mission Incident</th>
                  <th className="py-3 px-4">Pickup & Patient</th>
                  <th className="py-3 px-4">Destination Hospital</th>
                  <th className="py-3 px-4">Distance / Fare</th>
                  <th className="py-3 px-4">Milestone Status</th>
                  <th className="py-3 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {trips.map((trip) => {
                  const emergency = trip.emergency || trip.emergencyRequest;
                  const hospital =
                    trip.hospital || emergency?.destinationHospital;

                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-stone-50/50 transition-colors"
                    >
                      {/* Trip Reference */}
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        #{trip.id.slice(0, 8)}
                      </td>

                      {/* Pickup & Patient */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <span className="font-bold text-stone-900 flex items-center gap-1">
                            <User className="h-3 w-3 text-stone-400" />
                            <span>
                              {emergency?.patientName || "Emergency Patient"}
                            </span>
                          </span>
                          <span className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
                            <span>
                              {emergency?.pickupAddress || "Central Dhaka"}
                            </span>
                          </span>
                        </div>
                      </td>

                      {/* Destination Hospital */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <span className="font-semibold text-stone-800 flex items-center gap-1">
                            <HospitalIcon className="h-3.5 w-3.5 text-red-600 shrink-0" />
                            <span className="truncate">
                              {hospital?.name ||
                                "Dhaka Medical College Emergency"}
                            </span>
                          </span>
                        </div>
                      </td>

                      {/* Distance & Fare */}
                      <td className="py-3.5 px-4 font-mono text-stone-700">
                        <span className="font-bold block text-stone-900">
                          {trip.distanceKm != null
                            ? `${Number(trip.distanceKm).toFixed(1)} km`
                            : "—"}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {formatFare(trip.totalFare, "both")}
                        </span>
                      </td>

                      {/* Milestone Status Badge */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={trip.status} />
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-stone-400 shrink-0" />
                          <span>
                            {new Date(trip.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && (
            <div className="p-3 border-t border-stone-100">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                limit={meta.limit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
