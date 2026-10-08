"use client";

import { Route, Ruler, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatCard } from "@/components/dashboard/StatCard";
import { useTrips } from "@/lib/hooks/useTrips";
import type { Trip } from "@/types";

const DAYS = 7;

export function DriverEarningsView() {
  const { data, isLoading } = useTrips({
    page: 1,
    limit: 100,
    status: "COMPLETED",
  });
  const trips: Trip[] = Array.isArray(data)
    ? (data as Trip[])
    : data?.data || [];

  const stats = useMemo(() => {
    const totalFare = trips.reduce((s, t) => s + Number(t.totalFare || 0), 0);
    const totalKm = trips.reduce((s, t) => s + Number(t.distanceKm || 0), 0);

    const days = Array.from({ length: DAYS }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (DAYS - 1 - i));
      return { date: d, trips: 0, fare: 0 };
    });
    for (const t of trips) {
      const when = new Date(t.completedAt || t.createdAt);
      when.setHours(0, 0, 0, 0);
      const bucket = days.find((d) => d.date.getTime() === when.getTime());
      if (bucket) {
        bucket.trips += 1;
        bucket.fare += Number(t.totalFare || 0);
      }
    }
    return { totalFare, totalKm, days };
  }, [trips]);

  const maxFare = Math.max(1, ...stats.days.map((d) => d.fare));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Trips"
          value={trips.length}
          description="Latest 100 completed missions"
          icon={Route}
          variant="emerald"
          loading={isLoading}
        />
        <StatCard
          title="Service Value"
          value={`$${stats.totalFare.toFixed(2)}`}
          description="Fares from completed trips"
          icon={Wallet}
          variant="stone"
          loading={isLoading}
        />
        <StatCard
          title="Distance Driven"
          value={`${stats.totalKm.toFixed(1)} km`}
          description="Logged trip distance"
          icon={Ruler}
          variant="blue"
          loading={isLoading}
        />
        <StatCard
          title="Avg. Fare / Trip"
          value={`$${(trips.length ? stats.totalFare / trips.length : 0).toFixed(2)}`}
          description="Across completed trips"
          icon={TrendingUp}
          variant="amber"
          loading={isLoading}
        />
      </div>

      {trips.length === 0 && !isLoading ? (
        <EmptyState
          icon={Wallet}
          title="No Completed Trips Yet"
          description="Your daily performance breakdown will appear after your first completed mission."
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-black text-stone-900">Last 7 Days</h2>

          <div className="flex items-end gap-2 sm:gap-4 h-40">
            {stats.days.map((d) => (
              <div
                key={d.date.toISOString()}
                className="flex-1 flex flex-col items-center justify-end gap-1 h-full"
              >
                <span className="text-[10px] font-mono text-stone-500">
                  {d.fare > 0 ? `$${d.fare.toFixed(0)}` : ""}
                </span>
                <div
                  className="w-full rounded-t-lg bg-red-500/80"
                  style={{
                    height: `${(d.fare / maxFare) * 100}%`,
                    minHeight: d.fare > 0 ? 4 : 2,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 sm:gap-4">
            {stats.days.map((d) => (
              <div key={d.date.toISOString()} className="flex-1 text-center">
                <span className="block text-[10px] font-bold text-stone-700">
                  {d.date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="block text-[10px] text-stone-400">
                  {d.trips} trip{d.trips === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
