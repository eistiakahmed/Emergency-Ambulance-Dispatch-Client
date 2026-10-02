"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Plus,
  Search,
  Phone,
  MapPin,
  Activity,
  Bed,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateHospitalDialog } from "@/components/admin/CreateHospitalDialog";
import {
  useHospitals,
  useUpdateBedCapacity,
  useDeleteHospital,
} from "@/lib/hooks/useHospitals";
import type { Hospital } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function HospitalManager() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || undefined;
  const icuOnly = searchParams.get("icu") === "true";

  const { data: hospitalsData, isLoading } = useHospitals({
    page,
    limit: 10,
    search,
    hasIcu: icuOnly ? true : undefined,
  });

  const updateBedMutation = useUpdateBedCapacity();
  const deleteHospitalMutation = useDeleteHospital();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const hospitals: Hospital[] = Array.isArray(hospitalsData)
    ? (hospitalsData as Hospital[])
    : hospitalsData?.data || [];
  const meta = Array.isArray(hospitalsData) ? undefined : hospitalsData?.meta;

  const handleQuickAdjustBeds = async (
    hospital: Hospital,
    field: "icu" | "general",
    delta: number
  ) => {
    const currentIcu = hospital.icuBedsAvailable || hospital.availableIcuBeds || 0;
    const currentGeneral =
      hospital.emergencyBedsAvailable || hospital.availableGeneralBeds || 0;

    const newIcu = field === "icu" ? Math.max(0, currentIcu + delta) : currentIcu;
    const newGeneral =
      field === "general" ? Math.max(0, currentGeneral + delta) : currentGeneral;

    await updateBedMutation.mutateAsync({
      id: hospital.id,
      payload: {
        icuBedsAvailable: newIcu,
        emergencyBedsAvailable: newGeneral,
      },
    });
  };

  const handleDeleteHospital = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the dispatch registry?`)) {
      setDeletingId(id);
      try {
        await deleteHospitalMutation.mutateAsync(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filterGroups = [
    {
      key: "icu",
      label: "ICU Filter",
      options: [{ label: "Has ICU Facility", value: "true" }],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Add Hospital Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Partner Hospital Bed Network
            </h2>
            <p className="text-xs text-stone-500">
              {hospitals.length} registered hospital emergency centers in registry
            </p>
          </div>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          variant="emergency"
          size="sm"
          className="font-bold text-xs gap-1.5 shadow-xs shrink-0 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>REGISTER NEW HOSPITAL</span>
        </Button>
      </div>

      {/* 2. Search & Filters */}
      <SearchFilterBar
        placeholder="Search hospital name, area, address..."
        filterGroups={filterGroups}
      />

      {/* 3. Hospital List / Cards Table */}
      {hospitals.length === 0 && !isLoading ? (
        <EmptyState
          title="No Hospitals Found"
          description="Register your first hospital or adjust your search filter."
          icon={Building2}
          action={
            <Button
              onClick={() => setCreateDialogOpen(true)}
              variant="outline"
              size="sm"
              className="font-bold text-xs gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Hospital</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((hospital) => {
            const icuAvail =
              hospital.icuBedsAvailable ?? hospital.availableIcuBeds ?? 0;
            const erAvail =
              hospital.emergencyBedsAvailable ?? hospital.availableGeneralBeds ?? 0;
            const erTotal =
              hospital.emergencyBedsTotal ?? hospital.totalGeneralBeds ?? 20;

            const isDeleting = deletingId === hospital.id;

            return (
              <div
                key={hospital.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold border border-red-100">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 block">
                          ID: {hospital.id.slice(0, 8)}
                        </span>
                        <h3 className="font-bold text-stone-900 text-sm leading-tight line-clamp-1">
                          {hospital.name}
                        </h3>
                      </div>
                    </div>

                    {hospital.hasIcu ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 shrink-0 flex items-center gap-1">
                        <Activity className="h-3 w-3 text-rose-600" />
                        <span>ICU Active</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium shrink-0">
                        General ER
                      </span>
                    )}
                  </div>

                  {/* Location & Contact */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{hospital.address}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span>{hospital.contactPhone || hospital.contactNumber || "+88029883701"}</span>
                    </p>
                  </div>

                  {/* Live Capacity Controls */}
                  <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 space-y-2.5">
                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider block">
                      Live Bed Availability Quick Adjust
                    </span>

                    {/* ER Beds */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bed className="h-3.5 w-3.5 text-stone-500" />
                        <span className="text-xs font-semibold text-stone-800">
                          Emergency ER Beds:
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustBeds(hospital, "general", -1)}
                          disabled={erAvail <= 0 || updateBedMutation.isPending}
                          className="h-6 w-6 rounded-md bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-700 font-bold disabled:opacity-40 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs w-8 text-center text-stone-900">
                          {erAvail}/{erTotal}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustBeds(hospital, "general", 1)}
                          disabled={updateBedMutation.isPending}
                          className="h-6 w-6 rounded-md bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-700 font-bold disabled:opacity-40 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ICU Beds */}
                    {hospital.hasIcu && (
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-red-600" />
                          <span className="text-xs font-semibold text-stone-800">
                            Critical ICU Beds:
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustBeds(hospital, "icu", -1)}
                            disabled={icuAvail <= 0 || updateBedMutation.isPending}
                            className="h-6 w-6 rounded-md bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-700 font-bold disabled:opacity-40 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs w-8 text-center text-red-700">
                            {icuAvail}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustBeds(hospital, "icu", 1)}
                            disabled={updateBedMutation.isPending}
                            className="h-6 w-6 rounded-md bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-700 font-bold disabled:opacity-40 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-stone-100 text-xs">
                  <span className="text-[10px] text-stone-400 font-mono">
                    GPS: {hospital.latitude?.toFixed(2)}, {hospital.longitude?.toFixed(2)}
                  </span>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDeleteHospital(hospital.id, hospital.name)}
                    disabled={isDeleting}
                    className="h-7 text-[11px] text-stone-400 hover:text-red-600 hover:bg-red-50 font-bold gap-1"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Pagination */}
      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          limit={meta.limit}
        />
      )}

      {/* 5. Create Hospital Modal Dialog */}
      <CreateHospitalDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </div>
  );
}
