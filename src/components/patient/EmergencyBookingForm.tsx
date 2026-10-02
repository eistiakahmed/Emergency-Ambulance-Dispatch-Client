"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Siren,
  Heart,
  Activity,
  Wind,
  Baby,
  Cross,
  AlertTriangle,
  MapPin,
  Phone,
  User,
  Hospital as HospitalIcon,
  Navigation,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { useHospitals } from "@/lib/hooks/useHospitals";
import { useCreateEmergency } from "@/lib/hooks/useEmergencies";
import { useAppSelector } from "@/store/hooks";
import type { Hospital } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const EMERGENCY_TYPES = [
  {
    id: "CARDIAC",
    label: "Cardiac / Chest Pain",
    icon: Heart,
    color: "border-red-500 text-red-700 bg-red-50",
  },
  {
    id: "TRAUMA",
    label: "Accident / Severe Trauma",
    icon: Activity,
    color: "border-amber-500 text-amber-700 bg-amber-50",
  },
  {
    id: "RESPIRATORY",
    label: "Breathing / Oxygen Difficulty",
    icon: Wind,
    color: "border-blue-500 text-blue-700 bg-blue-50",
  },
  {
    id: "PREGNANCY",
    label: "Maternity / Labor Care",
    icon: Baby,
    color: "border-purple-500 text-purple-700 bg-purple-50",
  },
  {
    id: "GENERAL",
    label: "Critical General Sickness",
    icon: Cross,
    color: "border-emerald-500 text-emerald-700 bg-emerald-50",
  },
  {
    id: "OTHER",
    label: "Other Acute Emergency",
    icon: AlertTriangle,
    color: "border-stone-500 text-stone-700 bg-stone-50",
  },
] as const;

const SEVERITY_LEVELS = [
  {
    id: "CRITICAL",
    label: "Critical (Life Threatening)",
    desc: "Immediate ALS / ICU ambulance needed within minutes",
    border: "border-red-500",
    badge: "bg-red-600 text-white",
  },
  {
    id: "HIGH",
    label: "High Priority",
    desc: "Severe pain or deteriorating condition requiring urgent transport",
    border: "border-amber-500",
    badge: "bg-amber-600 text-white",
  },
  {
    id: "MEDIUM",
    label: "Standard Urgent",
    desc: "Stable vitals requiring standard emergency hospital transport",
    border: "border-blue-500",
    badge: "bg-blue-600 text-white",
  },
] as const;

export function EmergencyBookingForm() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { data: hospitalsData } = useHospitals({ limit: 10 });
  const createEmergencyMutation = useCreateEmergency();

  const [emergencyType, setEmergencyType] = useState<
    "CARDIAC" | "TRAUMA" | "RESPIRATORY" | "PREGNANCY" | "GENERAL" | "OTHER"
  >("CARDIAC");
  const [severityLevel, setSeverityLevel] = useState<
    "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  >("CRITICAL");
  const [patientName, setPatientName] = useState(user?.name || "");
  const [patientPhone, setPatientPhone] = useState(user?.phone || "");
  const [pickupAddress, setPickupAddress] = useState(
    "Banani Road 11, Block D, Dhaka, Bangladesh"
  );
  const [latitude, setLatitude] = useState(23.7937);
  const [longitude, setLongitude] = useState(90.4066);
  const [hospitalId, setHospitalId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [locating, setLocating] = useState(false);

  const hospitals = Array.isArray(hospitalsData)
    ? hospitalsData
    : hospitalsData?.data || [];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocating(false);
        toast.success("GPS Location Coordinates Acquired!", {
          description: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
        });
      },
      (err) => {
        setLocating(false);
        toast.error("Could not fetch GPS", { description: err.message });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error("Please provide patient name");
      return;
    }
    if (!patientPhone.trim()) {
      toast.error("Please provide emergency contact number");
      return;
    }
    if (!pickupAddress.trim()) {
      toast.error("Please provide pickup address");
      return;
    }

    await createEmergencyMutation.mutateAsync({
      patientName,
      patientPhone,
      emergencyType,
      severityLevel,
      pickupAddress,
      pickupLatitude: latitude,
      pickupLongitude: longitude,
      destinationHospitalId: hospitalId || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {/* 1. Emergency Type Grid */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <Siren className="h-4 w-4 text-red-600" />
            <span>1. Select Emergency Medical Category</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Helps dispatch the best suited ALS/BLS crew and specialized medical equipment.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {EMERGENCY_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = emergencyType === type.id;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setEmergencyType(type.id)}
                className={cn(
                  "flex flex-col items-start p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer gap-2",
                  isSelected
                    ? "border-red-600 bg-red-50/70 ring-2 ring-red-500/20 shadow-xs"
                    : "border-stone-200 hover:border-stone-300 bg-stone-50/40"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                    type.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-stone-900 leading-tight">
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Severity Level Selector */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>2. Emergency Severity & Triage Level</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Indicate patient urgency for rapid dispatch priority queue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SEVERITY_LEVELS.map((sev) => {
            const isSelected = severityLevel === sev.id;

            return (
              <button
                key={sev.id}
                type="button"
                onClick={() => setSeverityLevel(sev.id as "CRITICAL" | "HIGH" | "MEDIUM")}
                className={cn(
                  "p-3.5 rounded-xl border text-left space-y-2 transition-all cursor-pointer",
                  isSelected
                    ? `${sev.border} bg-stone-50/80 ring-2 ring-red-500/15 shadow-xs`
                    : "border-stone-200 hover:border-stone-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                    sev.badge
                  )}
                >
                  {sev.label}
                </span>
                <p className="text-xs text-stone-600 leading-snug">{sev.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Patient Details & Location */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-600" />
            <span>3. Patient Details & Pickup Location</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Accurate location ensures fastest turnaround ambulance navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Patient Full Name" required>
            <Input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. John Doe"
              prefixIcon={<User className="h-4 w-4 text-stone-400" />}
              className="bg-stone-50/50"
            />
          </FormField>

          <FormField label="Emergency Contact Phone" required>
            <Input
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="e.g. +880 1711-000000"
              prefixIcon={<Phone className="h-4 w-4 text-stone-400" />}
              className="bg-stone-50/50"
            />
          </FormField>
        </div>

        <FormField label="Exact Pickup Street Address" required>
          <div className="space-y-2">
            <Input
              type="text"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Building, Road No, Area, City..."
              prefixIcon={<MapPin className="h-4 w-4 text-stone-400" />}
              className="bg-stone-50/50"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] font-mono text-stone-500">
                GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={locating}
                className="h-7 text-xs font-bold gap-1.5"
              >
                {locating ? (
                  <Loader2 className="h-3 w-3 animate-spin text-red-600" />
                ) : (
                  <Navigation className="h-3 w-3 text-red-600" />
                )}
                <span>{locating ? "Acquiring GPS..." : "Auto-Locate Me via GPS"}</span>
              </Button>
            </div>
          </div>
        </FormField>
      </div>

      {/* 4. Preferred Destination Hospital & Notes */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <HospitalIcon className="h-4 w-4 text-emerald-600" />
            <span>4. Destination Hospital & Medical Notes</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Select a preferred emergency hospital or let our dispatch router select the nearest.
          </p>
        </div>

        <FormField label="Preferred Receiving Hospital (Optional)">
          <select
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <option value="">
              Auto-Select Nearest Emergency Hospital (Recommended)
            </option>
            {hospitals.map((h: Hospital) => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.availableIcuBeds} ICU / {h.availableGeneralBeds} Gen Free
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Critical Medical Symptoms / Allergies">
          <Input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Patient is diabetic, conscious, complaining of acute shortness of breath..."
            prefixIcon={<FileText className="h-4 w-4 text-stone-400" />}
            className="bg-stone-50/50"
          />
        </FormField>
      </div>

      {/* 5. Submit SOS Call Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="emergency"
          size="lg"
          disabled={createEmergencyMutation.isPending}
          className="w-full sm:flex-1 h-12 text-sm font-black tracking-wide shadow-md gap-2"
        >
          {createEmergencyMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>TRANSMITTING SOS BROADCAST...</span>
            </>
          ) : (
            <>
              <Siren className="h-5 w-5" />
              <span>BROADCAST INSTANT EMERGENCY SOS</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="w-full sm:w-auto h-12 text-xs font-bold"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
