"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, RefreshCw, LogOut, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  title,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = pathname.startsWith("/admin");
  const isDriver = pathname.startsWith("/provider");

  const portalName = isAdmin
    ? "Admin Console"
    : isDriver
    ? "Driver Console"
    : "Patient Portal";

  const currentSection = pathname === "/admin"
    ? "Overview"
    : pathname === "/provider"
    ? "Cockpit"
    : pathname === "/dashboard"
    ? "Overview"
    : pathname.split("/").pop() || "Dashboard";

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
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 lg:px-8 shadow-2xs">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-1.5 text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Clean Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
          <span className="text-stone-900 font-bold">{portalName}</span>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <span className="text-stone-600 capitalize">{title || currentSection}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live system radar status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Radar</span>
        </div>

        {/* Emergency 999 Hotline */}
        <a
          href="tel:999"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold hover:bg-red-100 transition-colors"
        >
          <PhoneCall className="h-3 w-3 text-red-600" />
          <span>999</span>
        </a>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center h-7 w-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw
              className={`h-3 w-3 ${isRefreshing ? "animate-spin text-red-600" : ""}`}
            />
          </button>
        )}

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <span className="text-xs font-bold text-stone-800 hidden md:inline">
            {user?.name || (isAdmin ? "Admin User" : isDriver ? "Driver" : "Patient")}
          </span>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
