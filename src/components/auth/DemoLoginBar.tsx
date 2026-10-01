"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";

export interface DemoRoleConfig {
  title: string;
  roleLabel: string;
  email: string;
  password: string;
  redirectUrl: string;
}

export const DEMO_ROLES: DemoRoleConfig[] = [
  {
    title: "System Administrator",
    roleLabel: "Admin",
    email: "admin@emergency.com",
    password: "AdminPass123!",
    redirectUrl: "/admin",
  },
  {
    title: "EMS Ambulance Driver",
    roleLabel: "Driver",
    email: "driver.john@emergency.com",
    password: "DriverPass123!",
    redirectUrl: "/provider",
  },
  {
    title: "Emergency Patient",
    roleLabel: "Patient",
    email: "patient.alice@emergency.com",
    password: "PatientPass123!",
    redirectUrl: "/dashboard",
  },
];

interface DemoLoginBarProps {
  onFillCredentials?: (email: string, pass: string) => void;
  className?: string;
}

export function DemoLoginBar({
  onFillCredentials,
  className,
}: DemoLoginBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleDemoLogin = async (config: DemoRoleConfig) => {
    if (onFillCredentials) {
      onFillCredentials(config.email, config.password);
    }

    try {
      setLoadingRole(config.roleLabel);
      const res = await authApi.login({
        email: config.email,
        password: config.password,
      });

      if (res?.user) {
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
          })
        );
        toast.success(`Logged in as ${config.title}!`, {
          description: `Redirecting to ${config.roleLabel}...`,
        });
        window.location.assign(config.redirectUrl);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in with demo credentials";
      toast.error("Demo Login Failed", {
        description: message,
      });
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className={cn("space-y-2.5 pt-1", className)}>
      {/* Header Divider */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-stone-200" />
        <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 bg-white px-1.5">
          <span>Quick 1-Click Demo Login</span>
        </div>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      {/* 3 Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEMO_ROLES.map((roleConfig) => {
          const isLoading = loadingRole === roleConfig.roleLabel;

          return (
            <button
              key={roleConfig.title}
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleDemoLogin(roleConfig)}
              className="group relative flex flex-row sm:flex-col items-center sm:items-start justify-between p-2.5 sm:p-3 text-left rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-red-400 hover:shadow-sm transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 gap-2"
            >
              {/* Role Title & Email */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="text-xs font-bold text-stone-900 group-hover:text-red-600 transition-colors">
                  {roleConfig.roleLabel}
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 font-mono truncate">
                  {roleConfig.email}
                </div>
              </div>

              {/* 1-Click Action Trigger */}
              <div className="flex items-center gap-1.5 sm:w-full sm:justify-between sm:pt-2 sm:border-t sm:border-stone-200/60 text-[11px] font-semibold text-stone-700 group-hover:text-red-600 shrink-0">
                <span className="text-[11px]">
                  {isLoading ? "Logging in..." : "1-Click"}
                </span>
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-red-600" />
                ) : (
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
