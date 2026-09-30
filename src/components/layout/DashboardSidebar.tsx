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
  History,
  CreditCard,
  User,
  Shield,
  Radio,
  LogOut,
  X,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
    }
  };

  // Define navigation by role
  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    if (user.role === "ADMIN") {
      return [
        {
          name: "Executive Overview",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          name: "Live Dispatch Queue",
          href: "/admin/dispatch",
          icon: Radio,
          badge: "Live",
        },
        {
          name: "Fleet & Hospitals",
          href: "/admin/manage",
          icon: Ambulance,
        },
        {
          name: "Audit Logs",
          href: "/admin/reports",
          icon: FileText,
        },
      ];
    }

    if (user.role === "DRIVER") {
      return [
        {
          name: "Active Task Console",
          href: "/provider",
          icon: Radio,
          badge: "FSM",
        },
        {
          name: "Shift Earnings & Trips",
          href: "/provider/earnings",
          icon: TrendingUp,
        },
        {
          name: "Driver & Vehicle Specs",
          href: "/provider/profile",
          icon: User,
        },
      ];
    }

    // Default: PATIENT
    return [
      {
        name: "My Emergencies",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Request Ambulance",
        href: "/dashboard/emergency/new",
        icon: PlusCircle,
        highlight: true,
      },
      {
        name: "Medical Profile",
        href: "/dashboard/profile",
        icon: User,
      },
      {
        name: "Payments & Invoices",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
      {
        name: "Hospital Bed Finder",
        href: "/hospitals",
        icon: Building2,
      },
    ];
  };

  const navItems = getNavItems();

  const roleLabel =
    user?.role === "ADMIN"
      ? "Dispatch Admin"
      : user?.role === "DRIVER"
      ? "Emergency Driver"
      : "Patient Member";

  const roleVariant =
    user?.role === "ADMIN"
      ? "default"
      : user?.role === "DRIVER"
      ? "secondary"
      : "success";

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-md transition-transform duration-300 dark:border-slate-800/80 dark:bg-slate-950/95 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-rose-600 to-red-500 text-white shadow-md shadow-rose-500/30">
              <Siren className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight">
                PulseRescue
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Command Console
              </p>
            </div>
          </Link>

          {/* Close for mobile */}
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold dark:bg-rose-950 dark:text-rose-300">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.name || "Anonymous User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant={roleVariant} className="text-[10px] px-2 py-0">
                  {roleLabel}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </p>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20 dark:bg-rose-600"
                    : item.highlight
                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 ${
                      isActive
                        ? "text-white"
                        : item.highlight
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <Badge
                    variant={isActive ? "outline" : "critical"}
                    className={`text-[10px] px-1.5 py-0 ${
                      isActive ? "bg-white/20 text-white border-transparent" : ""
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <Siren className="h-4 w-4 text-slate-400" />
            <span>Public Emergency Portal</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
