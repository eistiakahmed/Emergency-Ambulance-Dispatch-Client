"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, RefreshCw, LogOut, LayoutDashboard } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = pathname.startsWith("/admin");
  const isDriver = pathname.startsWith("/provider");

  const defaultTitle = isAdmin
    ? "Admin Command Center"
    : isDriver
    ? "Driver EMS Console"
    : "Patient Emergency Portal";

  const defaultSubtitle = isAdmin
    ? "Live dispatch overview, fleet governance & hospital network."
    : isDriver
    ? "Active mission workbench and GPS navigation telemetry."
    : "Instant SOS ambulance dispatch & hospital bed tracking.";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      toast.success("Successfully signed out");
      window.location.assign("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 lg:px-8 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-xl p-2 text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
            {title || defaultTitle}
          </h1>
          <p className="text-[11px] text-stone-500 hidden sm:block">
            {subtitle || defaultSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Emergency 999 Hotline */}
        <a
          href="tel:999"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors"
        >
          <PhoneCall className="h-3.5 w-3.5 text-red-600" />
          <span>999 HOTLINE</span>
        </a>

        {/* Live system radar status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online</span>
        </div>

        {/* Refresh button if provided */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center h-8 w-8 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
            title="Refresh live data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-red-600" : ""}`}
            />
          </button>
        )}

        {/* User Pill / Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-stone-900">
              {user?.name || (isAdmin ? "Admin User" : isDriver ? "EMS Driver" : "Patient")}
            </p>
            <p className="text-[10px] text-stone-500 font-mono">
              {user?.email || (isAdmin ? "admin@emergency.com" : isDriver ? "driver@emergency.com" : "patient@emergency.com")}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
