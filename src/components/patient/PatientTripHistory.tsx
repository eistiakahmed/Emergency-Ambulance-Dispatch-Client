"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Ambulance as AmbulanceIcon,
  Hospital as HospitalIcon,
  Receipt,
  Eye,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { Dialog } from "@/components/ui/dialog";
import { useTrips } from "@/lib/hooks/useTrips";
import type { Trip } from "@/types";

export function PatientTripHistory() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data: tripsData, isLoading } = useTrips({
    page,
    limit: 8,
    status,
  });

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const trips: Trip[] = Array.isArray(tripsData)
    ? (tripsData as Trip[])
    : tripsData?.data || [];
  const meta = Array.isArray(tripsData) ? undefined : tripsData?.meta;

  const filterGroups = [
    {
      key: "status",
      label: "Trip Status",
      options: [
        { label: "Completed", value: "COMPLETED" },
        { label: "In Progress", value: "EN_ROUTE" },
        { label: "Dispatched", value: "ACCEPTED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <SearchFilterBar
        placeholder="Search trip reference, address..."
        filterGroups={filterGroups}
      />

      {/* Trips Table / Cards */}
      {trips.length === 0 && !isLoading ? (
        <EmptyState
          icon={AmbulanceIcon}
          title="No Trip Records Found"
          description="You don't have any past ambulance trips matching the selected criteria."
          actionLabel="Request SOS Ambulance"
          onAction={() => window.location.assign("/dashboard/emergency/new")}
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Trip Reference</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Pickup Address</th>
                  <th className="py-3.5 px-4">Destination Hospital</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {trips.map((trip: Trip) => (
                  <tr
                    key={trip.id}
                    className="hover:bg-stone-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      #{trip.id.slice(0, 8)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-stone-400" />
                        <span>{new Date(trip.createdAt).toLocaleDateString()}</span>
                        <span className="text-stone-400">
                          {new Date(trip.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-stone-700">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span className="truncate">
                          {trip.emergencyRequest?.pickupAddress || "Pickup Location"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-stone-700">
                      <div className="flex items-center gap-1 truncate">
                        <HospitalIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          {trip.emergencyRequest?.destinationHospital?.name ||
                            "Emergency Center"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 whitespace-nowrap">
                      <span className="font-semibold text-stone-900">
                        {trip.ambulance?.vehicleNumber || "Assigned Ambulance"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={trip.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTrip(trip)}
                        className="h-7 px-2.5 text-xs font-bold gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
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

      {/* Detailed Trip Modal */}
      {selectedTrip && (
        <Dialog
          isOpen={Boolean(selectedTrip)}
          onClose={() => setSelectedTrip(null)}
          title={`Trip Details #${selectedTrip.id.slice(0, 8)}`}
          description="Complete emergency dispatch incident and transportation summary."
        >
          <div className="space-y-4 text-xs pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Current Status
                </span>
                <div className="mt-0.5">
                  <StatusBadge status={selectedTrip.status} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Dispatched At
                </span>
                <p className="font-mono font-bold text-stone-800">
                  {new Date(selectedTrip.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Pickup Point
                </span>
                <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-red-600 shrink-0" />
                  {selectedTrip.emergencyRequest?.pickupAddress}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Destination Hospital
                </span>
                <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <HospitalIcon className="h-4 w-4 text-emerald-600 shrink-0" />
                  {selectedTrip.emergencyRequest?.destinationHospital?.name ||
                    "Assigned Emergency Hospital"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Ambulance
                </span>
                <p className="font-bold text-stone-900">
                  {selectedTrip.ambulance?.vehicleNumber}
                </p>
                <p className="text-stone-500 text-[11px]">
                  Type: {selectedTrip.ambulance?.type}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Payment
                </span>
                <p className="font-bold text-emerald-700 flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Digital Gateway</span>
                </p>
                <p className="text-stone-500 text-[11px]">
                  Base Fare: ৳{selectedTrip.baseFare || "1,500"}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTrip(null)}
                className="font-bold text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
