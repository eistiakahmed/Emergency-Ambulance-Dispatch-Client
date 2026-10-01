"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Activity,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Siren,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useHospitals } from "@/lib/hooks/useHospitals";
import type { Hospital } from "@/types";

export function HospitalDirectory() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || undefined;
  const minIcu = searchParams.get("icu") === "available";

  const { data: hospitalsData, isLoading } = useHospitals({
    page,
    limit: 9,
    search,
    minIcuBeds: minIcu ? 1 : undefined,
  });

  const hospitals = hospitalsData?.data || [];
  const meta = hospitalsData?.meta;

  const filterGroups = [
    {
      key: "icu",
      label: "ICU Availability",
      options: [{ label: "Has Available ICU Beds", value: "available" }],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Capacity Filter Bar */}
      <SearchFilterBar
        placeholder="Search hospital name, address, area..."
        filterGroups={filterGroups}
      />

      {/* Hospital Cards Grid */}
      {hospitals.length === 0 && !isLoading ? (
        <EmptyState
          icon={Building2}
          title="No Hospital Facilities Found"
          description="No hospitals match your active search criteria. Try removing filters or searching by a different city/area."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hospitals.map((hospital: Hospital) => {
            const hasIcu = (hospital.availableIcuBeds ?? 0) > 0;
            const hasGen = (hospital.availableGeneralBeds ?? 0) > 0;

            return (
              <div
                key={hospital.id}
                className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 hover:border-red-300 hover:shadow-md transition-all duration-200"
              >
                {/* Header: Name & Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {hospital.name}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Verified Emergency Hub
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                        hasIcu
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {hasIcu ? "ICU Ready" : "Gen Only"}
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-stone-500 flex items-start gap-1.5 leading-relaxed line-clamp-2">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{hospital.address}</span>
                  </p>

                  {/* Bed Capacity Counters */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {/* ICU Beds */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between text-stone-500">
                        <span className="text-[10px] font-bold uppercase">
                          ICU Beds
                        </span>
                        <Activity className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-lg font-black ${
                            hasIcu ? "text-emerald-700" : "text-stone-400"
                          }`}
                        >
                          {hospital.availableIcuBeds ?? 0}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold">
                          / {hospital.totalIcuBeds ?? 10}
                        </span>
                      </div>
                    </div>

                    {/* General Beds */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between text-stone-500">
                        <span className="text-[10px] font-bold uppercase">
                          General ER
                        </span>
                        <Bed className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-lg font-black ${
                            hasGen ? "text-emerald-700" : "text-stone-400"
                          }`}
                        >
                          {hospital.availableGeneralBeds ?? 0}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold">
                          / {hospital.totalGeneralBeds ?? 40}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                  <a
                    href={`tel:${hospital.contactNumber || "999"}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-red-600 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-red-600" />
                    <span>{hospital.contactNumber || "+880 2-9888888"}</span>
                  </a>

                  <Link href="/dashboard/emergency/new">
                    <Button
                      variant="emergency"
                      size="sm"
                      className="h-8 text-xs font-bold gap-1 shadow-2xs"
                    >
                      <span>Select</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.limit}
        />
      )}
    </div>
  );
}
