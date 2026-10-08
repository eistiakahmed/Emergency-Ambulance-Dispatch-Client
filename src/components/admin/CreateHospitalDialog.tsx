"use client";

import {
  Activity,
  Bed,
  Building2,
  Loader2,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { useCreateHospital } from "@/lib/hooks/useHospitals";

export interface CreateHospitalDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateHospitalDialog({
  isOpen,
  onClose,
}: CreateHospitalDialogProps) {
  const createHospitalMutation = useCreateHospital();

  const [name, setName] = useState("");
  const [contactPhone, setContactPhone] = useState("+880");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(23.7808);
  const [longitude, setLongitude] = useState<number>(90.4226);
  const [emergencyBedsTotal, setEmergencyBedsTotal] = useState<number>(30);
  const [emergencyBedsAvailable, setEmergencyBedsAvailable] =
    useState<number>(12);
  const [hasIcu, setHasIcu] = useState(true);
  const [icuBedsAvailable, setIcuBedsAvailable] = useState<number>(4);
  const [locating, setLocating] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(6)));
        setLongitude(Number(pos.coords.longitude.toFixed(6)));
        setLocating(false);
        toast.success("GPS Coordinates Acquired");
      },
      (err) => {
        setLocating(false);
        toast.error("Could not fetch location", { description: err.message });
      },
      { timeout: 8000, enableHighAccuracy: true },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.length < 3) {
      newErrors.name = "Hospital name must be at least 3 characters";
    }
    if (!contactPhone.trim() || contactPhone.length < 6) {
      newErrors.contactPhone = "Valid contact telephone is required";
    }
    if (!address.trim() || address.length < 5) {
      newErrors.address = "Detailed hospital street address is required";
    }
    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
      newErrors.latitude = "Valid latitude between -90 and 90 required";
    }
    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      newErrors.longitude = "Valid longitude between -180 and 180 required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await createHospitalMutation.mutateAsync({
        name: name.trim(),
        contactPhone: contactPhone.trim(),
        address: address.trim(),
        latitude,
        longitude,
        emergencyBedsTotal: Number(emergencyBedsTotal),
        emergencyBedsAvailable: Number(emergencyBedsAvailable),
        hasIcu,
        icuBedsAvailable: hasIcu ? Number(icuBedsAvailable) : 0,
      });

      // Reset
      setName("");
      setAddress("");
      setContactPhone("+880");
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Partner Hospital"
      description="Add a certified emergency trauma center or general hospital into the real-time dispatch and bed availability registry."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
        {/* Hospital Name */}
        <FormField
          label="Hospital Name"
          error={errors.name}
          required
          htmlFor="hospital-name"
        >
          <div className="relative">
            <Input
              id="hospital-name"
              placeholder="e.g. Apollo Hospital Emergency & Trauma Wing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              className="pl-9"
            />
            <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          </div>
        </FormField>

        {/* Contact Phone & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            label="Emergency Contact Phone"
            error={errors.contactPhone}
            required
            htmlFor="hospital-phone"
          >
            <div className="relative">
              <Input
                id="hospital-phone"
                placeholder="+88029883701"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                error={errors.contactPhone}
                className="pl-9 font-mono"
              />
              <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          <FormField
            label="Full Street Address"
            error={errors.address}
            required
            htmlFor="hospital-address"
          >
            <div className="relative">
              <Input
                id="hospital-address"
                placeholder="Plot 81, Block E, Bashundhara, Dhaka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
                className="pl-9"
              />
              <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>
        </div>

        {/* GPS Coordinates & Pinpoint Button */}
        <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-red-600" />
              <span>Geographic GPS Coordinates (for ambulance routing)</span>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFetchGps}
              disabled={locating}
              className="h-6 text-[11px] font-bold gap-1"
            >
              {locating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Navigation className="h-3 w-3" />
              )}
              <span>Acquire GPS</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-medium text-stone-500 block mb-1">
                Latitude
              </label>
              <Input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-stone-500 block mb-1">
                Longitude
              </label>
              <Input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bed Capacity Metrics */}
        <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-stone-600" />
              <span>Bed & ICU Capacity Setup</span>
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-stone-700 select-none">
              <input
                type="checkbox"
                checked={hasIcu}
                onChange={(e) => setHasIcu(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-500"
              />
              <span>Has ICU Facility</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-medium text-stone-600 block mb-1">
                Total ER Beds
              </label>
              <Input
                type="number"
                min={1}
                value={emergencyBedsTotal}
                onChange={(e) =>
                  setEmergencyBedsTotal(parseInt(e.target.value, 10) || 0)
                }
                className="font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-stone-600 block mb-1">
                Available ER Beds
              </label>
              <Input
                type="number"
                min={0}
                value={emergencyBedsAvailable}
                onChange={(e) =>
                  setEmergencyBedsAvailable(parseInt(e.target.value, 10) || 0)
                }
                className="font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-stone-600 block mb-1 flex items-center gap-1">
                <Activity className="h-3 w-3 text-red-600" />
                <span>Available ICU Beds</span>
              </label>
              <Input
                type="number"
                min={0}
                disabled={!hasIcu}
                value={hasIcu ? icuBedsAvailable : 0}
                onChange={(e) =>
                  setIcuBedsAvailable(parseInt(e.target.value, 10) || 0)
                }
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="font-bold text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="emergency"
            size="sm"
            disabled={createHospitalMutation.isPending}
            className="font-bold text-xs gap-1.5 shadow-xs"
          >
            {createHospitalMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Building2 className="h-3.5 w-3.5" />
            )}
            <span>REGISTER HOSPITAL</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
