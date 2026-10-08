"use client";

import { CheckCircle2, CreditCard, Receipt, Wallet } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PaymentCheckoutModal } from "@/components/patient/PaymentCheckoutModal";
import { BkashIcon } from "@/components/ui/BkashLogo";
import { Button } from "@/components/ui/button";
import { useTrips } from "@/lib/hooks/useTrips";
import type { Trip } from "@/types";

const isPaid = (t: Trip) =>
  t.payment?.status === "SUCCEEDED" || t.payment?.status === "PAID";

// Same USD -> BDT rule the backend applies when initiating bKash payments.
const toBdt = (t: Trip) => {
  const raw = Number(t.totalFare || t.baseFare || 0);
  return raw > 500 ? Math.round(raw) : Math.max(10, Math.round(raw * 120));
};

export function PaymentHistory() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const { data, isLoading } = useTrips({
    page,
    limit: 10,
    status: "COMPLETED",
  });
  const [payingTrip, setPayingTrip] = useState<Trip | null>(null);

  const trips: Trip[] = Array.isArray(data)
    ? (data as Trip[])
    : data?.data || [];
  const meta = Array.isArray(data) ? undefined : data?.meta;

  const paidTotal = trips.filter(isPaid).reduce((s, t) => s + toBdt(t), 0);
  const dueTotal = trips
    .filter((t) => !isPaid(t))
    .reduce((s, t) => s + toBdt(t), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Completed Trips"
          value={meta?.total ?? trips.length}
          description="Billed emergency transfers"
          icon={Receipt}
          variant="stone"
          loading={isLoading}
        />
        <StatCard
          title="Paid (this page)"
          value={`৳${paidTotal.toLocaleString()}`}
          description="Settled via bKash"
          icon={CheckCircle2}
          variant="emerald"
          loading={isLoading}
        />
        <StatCard
          title="Outstanding (this page)"
          value={`৳${dueTotal.toLocaleString()}`}
          description="Awaiting payment"
          icon={Wallet}
          variant="amber"
          loading={isLoading}
        />
      </div>

      {trips.length === 0 && !isLoading ? (
        <EmptyState
          icon={CreditCard}
          title="No Payments Yet"
          description="Receipts for completed ambulance trips will appear here."
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Trip</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Base Fare</th>
                  <th className="py-3.5 px-4">Distance Fare</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {trips.map((trip) => {
                  const paid = isPaid(trip);
                  const base = Number(trip.baseFare || 0);
                  const total = Number(trip.totalFare || 0);
                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-stone-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        #{trip.id.slice(0, 8)}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                        {new Date(
                          trip.completedAt || trip.createdAt,
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        ${base.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        ${Math.max(0, total - base).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        ৳{toBdt(trip).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          status={paid ? "PAID" : "UNPAID"}
                          size="sm"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {paid ? (
                          <Link
                            href={`/payments/success?tripId=${trip.id}`}
                            className="inline-flex items-center h-7 px-2 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg gap-1 transition-colors"
                          >
                            <Receipt className="h-3 w-3" />
                            <span>Receipt</span>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setPayingTrip(trip)}
                            className="h-7 px-2.5 text-[11px] font-black bg-[#E2136E] hover:bg-[#C90E60] text-white gap-1.5"
                          >
                            <BkashIcon className="h-4 w-4" />
                            <span>Pay with bKash</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className="p-4 border-t border-stone-100">
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

      {payingTrip && (
        <PaymentCheckoutModal
          isOpen
          onClose={() => setPayingTrip(null)}
          trip={payingTrip}
        />
      )}
    </div>
  );
}
