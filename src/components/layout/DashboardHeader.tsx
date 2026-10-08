"use client";

import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Shield,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toggleSidebar } from "@/store/slices/uiSlice";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const SECTION_MAP: Record<string, string> = {
  "/admin": "Overview",
  "/admin/dispatch": "Dispatch Workbench",
  "/admin/manage": "Fleet & Hospitals",
  "/admin/fleet": "Fleet & Drivers",
  "/admin/hospitals": "Hospital Bed Network",
  "/admin/reports": "Audit Logs",
  "/admin/profile": "Profile Settings",
  "/provider": "Driver Cockpit",
  "/provider/mission": "Active Mission",
  "/provider/history": "Shift History",
  "/provider/earnings": "Earnings & Performance",
  "/provider/profile": "Profile Settings",
  "/dashboard": "Overview",
  "/dashboard/emergency/new": "Request SOS",
  "/dashboard/trips": "Emergency Trips",
  "/dashboard/payments": "Payments & Receipts",
  "/dashboard/profile": "Profile Settings",
  "/hospitals": "Hospital Bed Finder",
};

export function DashboardHeader({
  title,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = pathname.startsWith("/admin");
  const isDriver = pathname.startsWith("/provider");

  const portalName = isAdmin
    ? "Admin Console"
    : isDriver
      ? "Driver Console"
      : "Patient Portal";

  const getSectionTitle = () => {
    if (title) return title;
    if (SECTION_MAP[pathname]) return SECTION_MAP[pathname];
    if (pathname.startsWith("/dashboard/trips/")) return "Trip Details";
    const segment = pathname.split("/").filter(Boolean).pop();
    if (!segment) return "Dashboard";
    return (
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    );
  };

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

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const currentSection = getSectionTitle();
  const displayName =
    user?.name || (isAdmin ? "Central Admin" : isDriver ? "Driver" : "Patient");
  const displayRole = user?.role || (isAdmin ? "ADMIN" : isDriver ? "DRIVER" : "PATIENT");

  const homeHref = isAdmin ? "/admin" : isDriver ? "/provider" : "/dashboard";
  const profileHref = isAdmin
    ? "/admin/profile"
    : isDriver
      ? "/provider/profile"
      : "/dashboard/profile";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 lg:px-8 shadow-2xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
          <span className="text-stone-900 font-bold">{portalName}</span>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span className="text-stone-600 font-medium truncate max-w-[140px] sm:max-w-none">
            {currentSection}
          </span>
        </div>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Optional refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-red-600" : ""}`}
            />
          </button>
        )}

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200/80 bg-stone-50/70 hover:bg-white hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            {/* Avatar with status indicator */}
            <div className="relative shrink-0">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover border border-stone-200"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100/80 text-red-700 border border-red-200/80 font-black text-xs shadow-2xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            {/* Name & Role Text */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-stone-900 group-hover:text-red-600 transition-colors leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] font-semibold text-stone-400 capitalize leading-tight">
                {displayRole.toLowerCase()}
              </span>
            </div>

            <ChevronDown
              className={`h-3.5 w-3.5 text-stone-400 group-hover:text-stone-600 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Floating Popover */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
              {/* User Overview Section */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50/80 border border-stone-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 font-black text-sm border border-red-200">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate font-mono">
                    {user?.email || "Signed In"}
                  </div>
                  <div className="mt-1">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-stone-200/70 text-stone-700">
                      {displayRole}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="mt-2 space-y-0.5">
                <Link
                  href={homeHref}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-stone-400" />
                  <span>{isAdmin ? "Command Center" : "Console Overview"}</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/reports"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                  >
                    <Shield className="h-4 w-4 text-stone-400" />
                    <span>Audit Logs & Governance</span>
                  </Link>
                )}

                <Link
                  href={profileHref}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-stone-400" />
                  <span>Profile Settings</span>
                </Link>
              </div>

              {/* Sign Out Action */}
              <div className="mt-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
