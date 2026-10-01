"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Ambulance as AmbulanceIcon,
  Search,
  MapPin,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useAmbulances } from "@/lib/hooks/useAmbulances";
import type { Ambulance } from "@/types";

export function FleetManager() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;

  const { data: ambulancesData, isLoading } = useAmbulances({
    page,
    limit: 8,
    status,
    type,
  });

  const ambulances = ambulancesData?.data || [];
  const meta = ambulancesData?.meta;

  const filterGroups = [
    {
      key: "status",
      label: "Fleet Status",
      options: [
        { label: "Available (Ready)", value: "AVAILABLE" },
        { label: "Busy / On Call", value: "BUSY" },
        { label: "On Active Trip", value: "ON_TRIP" },
        { label: "In Maintenance", value: "MAINTENANCE" },
        { label: "Offline", value: "OFFLINE" },
      ],
    },
    {
      key: "type",
      label: "Vehicle Type",
      options: [
        { label: "ALS (Advanced Life Support)", value: "ALS" },
        { label: "BLS (Basic Life Support)", value: "BLS" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <SearchFilterBar
        placeholder="Search plate, vehicle number, driver..."
        filterGroups={filterGroups}
      />

      {ambulances.length === 0 && !isLoading ? (
        <EmptyState
          icon={AmbulanceIcon}
          title="No Fleet Vehicles Found"
          description="No ambulances match the selected filters or status criteria."
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Vehicle Unit</th>
                  <th className="py-3.5 px-4">Type & Model</th>
                  <th className="py-3.5 px-4">Assigned Driver</th>
                  <th className="py-3.5 px-4">Base Coordinates</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {ambulances.map((amb: Ambulance) => (
                  <tr
                    key={amb.id}
                    className="hover:bg-stone-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100 font-bold shrink-0">
                          <AmbulanceIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">
                            {amb.vehicleNumber || amb.plateNumber || "EMS-901"}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            ID: {amb.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800 block">
                        {amb.type}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {amb.model || "Mercedes Sprinter ICU"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-stone-900">
                        <User className="h-3.5 w-3.5 text-stone-400" />
                        <span>{amb.driver?.name || "Assigned Driver"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
                        <span>
                          {amb.baseLatitude?.toFixed(4) || "23.7937"},{" "}
                          {amb.baseLongitude?.toFixed(4) || "90.4066"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={amb.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                          amb.status === "AVAILABLE"
                            ? "text-emerald-700"
                            : amb.status === "ON_TRIP" || amb.status === "BUSY"
                            ? "text-blue-700"
                            : "text-stone-500"
                        }`}
                      >
                        {amb.status === "AVAILABLE" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>100% Ready</span>
                          </>
                        ) : amb.status === "ON_TRIP" ? (
                          <>
                            <AlertCircle className="h-3.5 w-3.5 text-blue-600" />
                            <span>On Mission</span>
                          </>
                        ) : (
                          <span>Standby</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className="p-4 border-t border-stone-100">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                pageSize={meta.limit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
