import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FleetManager } from "@/components/admin/FleetManager";
import { HospitalManager } from "@/components/admin/HospitalManager";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fleet & Hospital Management | PulseRescue Admin",
  description:
    "Manage ambulances, drivers, hospitals and bed capacity in one place.",
};

const tabs = [
  { key: "fleet", label: "Fleet & Drivers" },
  { key: "hospitals", label: "Hospitals & Beds" },
] as const;

export default async function AdminManagePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = tab === "hospitals" ? "hospitals" : "fleet";

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Fleet &amp; Hospital Management
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Register and monitor ambulances, assign drivers, and keep hospital bed
          counts current.
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-stone-100 w-fit">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/manage?tab=${t.key}`}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-colors",
              active === t.key
                ? "bg-white text-red-700 shadow-2xs"
                : "text-stone-600 hover:text-stone-900",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <Suspense
        key={active}
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        {active === "fleet" ? <FleetManager /> : <HospitalManager />}
      </Suspense>
    </div>
  );
}
