"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, User, Ambulance, Mail, Phone, Lock, FileText, Truck } from "lucide-react";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/Tabs";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  registerPatientSchema,
  registerDriverSchema,
  type RegisterPatientInput,
  type RegisterDriverInput,
} from "@/lib/schemas/auth.schema";
import { authApi } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeRoleTab, setActiveRoleTab] = useState<"PATIENT" | "DRIVER">("PATIENT");

  // Patient Form State
  const [patientForm, setPatientForm] = useState<RegisterPatientInput>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Driver Form State
  const [driverForm, setDriverForm] = useState<RegisterDriverInput>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "BASIC_LIFE_SUPPORT",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (id: string) => {
    setActiveRoleTab(id as "PATIENT" | "DRIVER");
    setErrors({});
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = registerPatientSchema.safeParse(patientForm);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.registerPatient(patientForm);

      if (res?.user && res?.accessToken) {
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
          })
        );
        toast.success(`Account Created!`, {
          description: `Welcome to Pulse EMS, ${res.user.name}.`,
        });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to register patient account.";
      toast.error("Registration Failed", {
        description: message,
      });
      setErrors({ email: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = registerDriverSchema.safeParse(driverForm);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.registerDriver(driverForm);

      if (res?.user && res?.accessToken) {
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
          })
        );
        toast.success(`Driver Onboarded!`, {
          description: `Welcome to the active fleet, ${res.user.name}.`,
        });
        router.push("/provider");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to register driver account.";
      toast.error("Registration Failed", {
        description: message,
      });
      setErrors({ email: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Role Switcher Tabs */}
      <Tabs
        tabs={[
          {
            id: "PATIENT",
            label: "Patient",
            icon: <User className="h-4 w-4" />,
          },
          {
            id: "DRIVER",
            label: "Driver",
            icon: <Ambulance className="h-4 w-4" />,
          },
        ]}
        activeTab={activeRoleTab}
        onChange={handleTabChange}
      />

      {/* Patient Registration Form */}
      {activeRoleTab === "PATIENT" && (
        <form onSubmit={handlePatientSubmit} className="space-y-4">
          <FormField label="Full Name" error={errors.name} required htmlFor="patientName">
            <div className="relative">
              <Input
                id="patientName"
                placeholder="Alice Rahman"
                value={patientForm.name}
                onChange={(e) =>
                  setPatientForm((prev) => ({ ...prev, name: e.target.value }))
                }
                error={errors.name}
                className="pl-10"
              />
              <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          <FormField label="Email Address" error={errors.email} required htmlFor="patientEmail">
            <div className="relative">
              <Input
                id="patientEmail"
                type="email"
                placeholder="alice@example.com"
                value={patientForm.email}
                onChange={(e) =>
                  setPatientForm((prev) => ({ ...prev, email: e.target.value }))
                }
                error={errors.email}
                className="pl-10"
              />
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          <FormField
            label="Phone Number"
            error={errors.phone}
            helperText="Format: 01XXXXXXXXX"
            required
            htmlFor="patientPhone"
          >
            <div className="relative">
              <Input
                id="patientPhone"
                type="tel"
                placeholder="01712345678"
                value={patientForm.phone}
                onChange={(e) =>
                  setPatientForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                error={errors.phone}
                className="pl-10"
              />
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Password" error={errors.password} required htmlFor="patientPassword">
              <PasswordInput
                id="patientPassword"
                placeholder="••••••••"
                value={patientForm.password}
                onChange={(e) =>
                  setPatientForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                error={!!errors.password}
              />
            </FormField>

            <FormField
              label="Confirm Password"
              error={errors.confirmPassword}
              required
              htmlFor="patientConfirmPassword"
            >
              <PasswordInput
                id="patientConfirmPassword"
                placeholder="••••••••"
                value={patientForm.confirmPassword}
                onChange={(e) =>
                  setPatientForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                error={!!errors.confirmPassword}
              />
            </FormField>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-sm sm:text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 rounded-xl transition-all mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Register as Patient</span>
              </span>
            )}
          </Button>
        </form>
      )}

      {/* Driver Registration Form */}
      {activeRoleTab === "DRIVER" && (
        <form onSubmit={handleDriverSubmit} className="space-y-4">
          <FormField label="Driver Full Name" error={errors.name} required htmlFor="driverName">
            <div className="relative">
              <Input
                id="driverName"
                placeholder="Captain John Doe"
                value={driverForm.name}
                onChange={(e) =>
                  setDriverForm((prev) => ({ ...prev, name: e.target.value }))
                }
                error={errors.name}
                className="pl-10"
              />
              <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Email Address" error={errors.email} required htmlFor="driverEmail">
              <Input
                id="driverEmail"
                type="email"
                placeholder="driver@example.com"
                value={driverForm.email}
                onChange={(e) =>
                  setDriverForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                error={errors.email}
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phone} required htmlFor="driverPhone">
              <Input
                id="driverPhone"
                type="tel"
                placeholder="01812345678"
                value={driverForm.phone}
                onChange={(e) =>
                  setDriverForm((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                error={errors.phone}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Driver License No."
              error={errors.licenseNumber}
              required
              htmlFor="driverLicense"
            >
              <Input
                id="driverLicense"
                placeholder="DL-DHAKA-98210"
                value={driverForm.licenseNumber}
                onChange={(e) =>
                  setDriverForm((prev) => ({
                    ...prev,
                    licenseNumber: e.target.value,
                  }))
                }
                error={errors.licenseNumber}
                className="uppercase"
              />
            </FormField>

            <FormField
              label="Vehicle Type Capability"
              error={errors.vehicleType}
              required
              htmlFor="vehicleType"
            >
              <select
                id="vehicleType"
                value={driverForm.vehicleType}
                onChange={(e) =>
                  setDriverForm((prev) => ({
                    ...prev,
                    vehicleType: e.target.value as RegisterDriverInput["vehicleType"],
                  }))
                }
                className="flex h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-900 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none"
              >
                <option value="BASIC_LIFE_SUPPORT">Basic Life Support (BLS)</option>
                <option value="ADVANCED_LIFE_SUPPORT">Advanced Life Support (ALS)</option>
                <option value="PATIENT_TRANSPORT">Patient Transport</option>
                <option value="NEONATAL">Neonatal ICU Unit</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Password" error={errors.password} required htmlFor="driverPassword">
              <PasswordInput
                id="driverPassword"
                placeholder="••••••••"
                value={driverForm.password}
                onChange={(e) =>
                  setDriverForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                error={!!errors.password}
              />
            </FormField>

            <FormField
              label="Confirm Password"
              error={errors.confirmPassword}
              required
              htmlFor="driverConfirmPassword"
            >
              <PasswordInput
                id="driverConfirmPassword"
                placeholder="••••••••"
                value={driverForm.confirmPassword}
                onChange={(e) =>
                  setDriverForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                error={!!errors.confirmPassword}
              />
            </FormField>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-sm sm:text-base font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/25 rounded-xl transition-all mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Onboarding Driver...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Ambulance className="h-4 w-4" />
                <span>Register Driver Application</span>
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
