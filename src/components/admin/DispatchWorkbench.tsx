"use client";

import { MapPin, Phone, Siren, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AssignAmbulanceDialog } from "@/components/admin/AssignAmbulanceDialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Pagination } from "@/components/dashboard/Pagination";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmergencies } from "@/lib/hooks/useEmergencies";
import type { EmergencyRequest } from "@/types";

const SKELETON_ROW_COUNT = 8;
const SKELETON_ROW_KEYS = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, i) => `dispatch-skeleton-row-${i}`,
);

function DispatchTableSkeleton() {
  return (
    <>
      {SKELETON_ROW_KEYS.map((rowKey) => (
        <tr key={rowKey}>
          {/* Ref # */}
          <td className="py-3.5 px-4">
            <Skeleton className="h-3.5 w-16 rounded-md" />
          </td>
          {/* Emergency Type */}
          <td className="py-3.5 px-4">
            <Skeleton className="h-3.5 w-14 rounded-md" />
          </td>
          {/* Patient Info (two lines) */}
          <td className="py-3.5 px-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-2.5 w-20 rounded-md" />
            </div>
          </td>
          {/* Pickup Address */}
          <td className="py-3.5 px-4">
            <Skeleton className="h-3.5 w-32 rounded-md" />
          </td>
          {/* Severity pill */}
          <td className="py-3.5 px-4">
            <Skeleton className="h-4 w-14 rounded-md" />
          </td>
          {/* Status pill */}
          <td className="py-3.5 px-4">
            <Skeleton className="h-4 w-16 rounded-full" />
          </td>
          {/* Dispatch Action button */}
          <td className="py-3.5 px-4 text-right">
            <Skeleton className="ml-auto h-7 w-24 rounded-md" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function DispatchWorkbench() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || undefined;
  const emergencyType = searchParams.get("type") || undefined;

  const { data: emergenciesData, isLoading } = useEmergencies({
    page,
    limit: 8,
    status,
    emergencyType,
  });

  const [assignEmergency, setAssignEmergency] =
    useState<EmergencyRequest | null>(null);

  const emergencies: EmergencyRequest[] = Array.isArray(emergenciesData)
    ? (emergenciesData as EmergencyRequest[])
    : emergenciesData?.data || [];
  const meta = Array.isArray(emergenciesData)
    ? undefined
    : emergenciesData?.meta;

  const filterGroups = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Pending Dispatch", value: "PENDING" },
        { label: "Assigned", value: "ACCEPTED" },
        { label: "En Route", value: "EN_ROUTE" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
    {
      key: "type",
      label: "Emergency Type",
      options: [
        { label: "Cardiac", value: "CARDIAC" },
        { label: "Trauma / Accident", value: "TRAUMA" },
        { label: "Respiratory", value: "RESPIRATORY" },
        { label: "Pregnancy", value: "PREGNANCY" },
        { label: "General", value: "GENERAL" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Siren className="h-4 w-4 text-red-600" />
            <span>Emergency Dispatch Workbench</span>
          </h2>
          <p className="text-xs text-stone-500">
            Real-time emergency incident queue with manual & automated vehicle
            routing.
          </p>
        </div>
      </div>

      {/* Filter Bar with URL searchParams sync */}
      <SearchFilterBar
        placeholder="Search patient, address, incident..."
        filterGroups={filterGroups}
      />

      {/* Emergency Incidents Table */}
      {emergencies.length === 0 && !isLoading ? (
        <EmptyState
          icon={Siren}
          title="No Emergency Calls Found"
          description="There are currently no emergency incidents matching your active filters."
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Ref #</th>
                  <th className="py-3.5 px-4">Emergency Type</th>
                  <th className="py-3.5 px-4">Patient Info</th>
                  <th className="py-3.5 px-4">Pickup Address</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {isLoading ? (
                  <DispatchTableSkeleton />
                ) : (
                  emergencies.map((em) => {
                    const isPending = em.status === "PENDING";

                    return (
                      <tr
                        key={em.id}
                        className="hover:bg-stone-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          #{em.id.slice(0, 8)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900">
                            {em.emergencyType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-bold text-stone-900 flex items-center gap-1">
                              <User className="h-3 w-3 text-stone-400" />
                              <span>{em.patientName}</span>
                            </div>
                            <a
                              href={`tel:${em.patientPhone}`}
                              className="text-[11px] text-stone-500 hover:text-red-600 flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3 text-stone-400" />
                              <span>{em.patientPhone}</span>
                            </a>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-stone-700">
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            <span className="truncate">{em.pickupAddress}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              em.severityLevel === "CRITICAL"
                                ? "bg-red-600 text-white"
                                : em.severityLevel === "HIGH"
                                  ? "bg-amber-600 text-white"
                                  : "bg-blue-600 text-white"
                            }`}
                          >
                            {em.severityLevel || "CRITICAL"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={em.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isPending ? (
                            <Button
                              variant="emergency"
                              size="sm"
                              onClick={() => setAssignEmergency(em)}
                              className="h-7 px-2.5 text-xs font-black gap-1 shadow-xs"
                            >
                              <Siren className="h-3 w-3" />
                              <span>Assign Unit</span>
                            </Button>
                          ) : (
                            <span className="text-[11px] font-semibold text-stone-500">
                              Unit Assigned
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {isLoading ? (
            <div className="p-4 border-t border-stone-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <Skeleton className="h-3.5 w-40 rounded-md" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="hidden sm:block h-8 w-8 rounded-lg" />
                  <Skeleton className="hidden sm:block h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ) : meta ? (
            <div className="p-4 border-t border-stone-100">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                pageSize={meta.limit}
              />
            </div>
          ) : null}
        </div>
      )}

      {/* Assign Ambulance Modal */}
      {assignEmergency && (
        <AssignAmbulanceDialog
          emergency={assignEmergency}
          onClose={() => setAssignEmergency(null)}
        />
      )}
    </div>
  );
}
