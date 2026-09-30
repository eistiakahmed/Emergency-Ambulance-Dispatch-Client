"use client";

import React from "react";
import { Menu, Bell, Shield, Radio, Activity, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { Badge } from "@/components/ui/badge";

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {title || "Dashboard Console"}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live status badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span>System Online</span>
        </div>

        {/* Optional Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 p-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Refresh live data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-rose-600" : ""}`}
            />
          </button>
        )}

        {/* Role Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-rose-500 to-red-600 text-white font-bold text-sm shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
