"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Siren,
  LayoutDashboard,
  Ambulance,
  Building2,
  FileText,
  Clock,
  Radio,
  LogOut,
  X,
  PlusCircle,
  TrendingUp,
  User,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      toast.success("Signed out successfully");
      window.location.assign("/login");
    }
  };

  // Determine role from route or user object
  const isAdmin = pathname.startsWith("/admin") || user?.role === "ADMIN";
  const isDriver = pathname.startsWith("/provider") || user?.role === "DRIVER";

  const getNavItems = (): NavItem[] => {
    if (isAdmin) {
      return [
        {
          name: "Command Center",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          name: "Dispatch Workbench",
          href: "/admin#dispatch",
          icon: Radio,
          badge: "Live",
        },
        {
          name: "Fleet & Drivers",
          href: "/admin#fleet",
          icon: Ambulance,
        },
        {
          name: "Hospital ICU Beds",
          href: "/hospitals",
          icon: Building2,
        },
      ];
    }

    if (isDriver) {
      return [
        {
          name: "Driver Cockpit",
          href: "/provider",
          icon: Radio,
          badge: "FSM",
        },
        {
          name: "Active Mission",
          href: "/provider#mission",
          icon: Ambulance,
        },
        {
          name: "Shift History",
          href: "/provider#history",
          icon: Clock,
        },
      ];
    }

    // Default: Patient
    return [
      {
        name: "Patient Portal",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Request SOS Ambulance",
        href: "/dashboard/emergency/new",
        icon: PlusCircle,
        highlight: true,
      },
      {
        name: "Emergency Trips",
        href: "/dashboard/trips",
        icon: Clock,
      },
      {
        name: "Hospital Bed Finder",
        href: "/hospitals",
        icon: Building2,
      },
    ];
  };

  const navItems = getNavItems();

  const roleLabel = isAdmin
    ? "System Admin"
    : isDriver
    ? "EMS Driver"
    : "Patient Member";

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white shadow-xs transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-stone-100">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-600/25 group-hover:bg-red-700 transition-colors">
              <Siren className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-stone-900 flex items-center gap-1">
                PulseRescue
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
                {roleLabel} Console
              </span>
            </div>
          </Link>

          {/* Close for mobile */}
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 mx-3 my-3 rounded-xl bg-stone-50 border border-stone-200/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : isAdmin ? "A" : isDriver ? "D" : "P"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-stone-900">
                {user?.name || (isAdmin ? "Admin Console" : isDriver ? "Driver Unit" : "Patient Portal")}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-100 uppercase tracking-wider">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Navigation Menu
          </p>

          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href.includes("#") && pathname === item.href.split("#")[0]);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-stone-900 text-white font-bold shadow-2xs"
                    : item.highlight
                    ? "bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive
                        ? "text-white"
                        : item.highlight
                        ? "text-red-600"
                        : "text-stone-400 group-hover:text-stone-700"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-red-600 text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-stone-100 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <Siren className="h-3.5 w-3.5 text-stone-400" />
            <span>Public Home</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
