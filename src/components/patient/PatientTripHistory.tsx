"use client";

import {
  Ambulance as AmbulanceIcon,
  Calendar,
  CreditCard,
  Eye,
  Hospital as HospitalIcon,
  MapPin,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Pagination } from "@/components/dashboard/Pagination";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PaymentCheckoutModal } from "@/components/patient/PaymentCheckoutModal";
import { BkashIcon } from "@/components/ui/BkashLogo";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useTrips } from "@/lib/hooks/useTrips";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types";

export function PatientTripHistory() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || undefined;
  const _search = searchParams.get("search") || undefined;

  const { data: tripsData, isLoading } = useTrips({
    page,
    limit: 8,
    status,
  });

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [payingTrip, setPayingTrip] = useState<Trip | null>(null);

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
                  <th className="py-3.5 px-4">Fare / Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {trips.map((trip: Trip) => {
                  const isCompleted = trip.status === "COMPLETED";
                  const isPaid =
                    trip.payment?.status === "SUCCEEDED" ||
                    trip.payment?.status === "PAID";
                  const rawFare = Number(
                    trip.totalFare || trip.baseFare || 1500,
                  );
                  const bdtFare =
                    rawFare > 500
                      ? Math.round(rawFare)
                      : Math.max(10, Math.round(rawFare * 120));

                  return (
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
                          <span>
                            {new Date(trip.createdAt).toLocaleDateString()}
                          </span>
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
                            {trip.emergencyRequest?.pickupAddress ||
                              "Pickup Location"}
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
                      <td className="py-3.5 px-4 text-stone-700 whitespace-nowrap font-mono">
                        <div className="space-y-0.5">
                          <span className="font-bold block text-stone-900">
                            ৳{bdtFare.toLocaleString()}
                          </span>
                          <span
                            className={cn(
                              "inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase",
                              isPaid
                                ? "bg-emerald-100 text-emerald-800"
                                : isCompleted
                                  ? "bg-amber-100 text-amber-800"
                                  : "text-stone-400",
                            )}
                          >
                            {isPaid
                              ? "PAID"
                              : isCompleted
                                ? "UNPAID"
                                : "ESTIMATED"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={trip.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isCompleted && !isPaid && (
                            <Button
                              size="sm"
                              onClick={() => setPayingTrip(trip)}
                              className="h-7 px-2.5 text-[11px] font-black bg-[#E2136E] hover:bg-[#C90E60] text-white shadow-2xs gap-1.5"
                            >
                              <BkashIcon className="h-4 w-4" />
                              <span>Pay with bKash</span>
                            </Button>
                          )}

                          {isPaid && (
                            <Link
                              href={`/payments/success?tripId=${trip.id}`}
                              className="inline-flex items-center h-7 px-2 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg gap-1 transition-colors shadow-2xs"
                            >
                              <Receipt className="h-3 w-3" />
                              <span>Receipt</span>
                            </Link>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTrip(trip)}
                            className="h-7 px-2 text-[11px] font-bold gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  Payment Status
                </span>
                <p className="font-bold text-emerald-700 flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                  <span>
                    {selectedTrip.payment?.status === "SUCCEEDED"
                      ? "Settled / Paid"
                      : "Pending Payment"}
                  </span>
                </p>
                <p className="text-stone-500 text-[11px] font-mono">
                  Fare: ৳
                  {Number(
                    selectedTrip.totalFare || selectedTrip.baseFare || 1500,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTrip(null)}
                className="font-bold text-xs"
              >
                Close
              </Button>

              {selectedTrip.status === "COMPLETED" &&
                selectedTrip.payment?.status !== "SUCCEEDED" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const t = selectedTrip;
                      setSelectedTrip(null);
                      setPayingTrip(t);
                    }}
                    className="font-black text-xs bg-[#E2136E] hover:bg-[#C90E60] text-white shadow-sm"
                  >
                    Pay with bKash (৳)
                  </Button>
                )}
            </div>
          </div>
        </Dialog>
      )}

      {/* Payment Modal */}
      {payingTrip && (
        <PaymentCheckoutModal
          isOpen={Boolean(payingTrip)}
          onClose={() => setPayingTrip(null)}
          trip={payingTrip}
        />
      )}
    </div>
  );
}
