"use client";

import {
  Ambulance,
  Building2,
  Clock,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Radio,
  ScrollText,
  Siren,
  UserCircle,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { setSidebarOpen } from "@/store/slices/uiSlice";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
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
          href: "/admin/dispatch",
          icon: Radio,
        },
        {
          name: "Fleet & Hospitals",
          href: "/admin/manage",
          icon: Ambulance,
        },
        {
          name: "Audit Logs",
          href: "/admin/reports",
          icon: ScrollText,
        },
        {
          name: "Profile Settings",
          href: "/admin/profile",
          icon: UserCircle,
        },
      ];
    }

    if (isDriver) {
      return [
        {
          name: "Driver Cockpit",
          href: "/provider",
          icon: Radio,
        },
        {
          name: "Active Mission",
          href: "/provider/mission",
          icon: Ambulance,
        },
        {
          name: "Shift History",
          href: "/provider/history",
          icon: Clock,
        },
        {
          name: "Earnings",
          href: "/provider/earnings",
          icon: Wallet,
        },
        {
          name: "Profile Settings",
          href: "/provider/profile",
          icon: UserCircle,
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
      },
      {
        name: "Emergency Trips",
        href: "/dashboard/trips",
        icon: Clock,
      },
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
      {
        name: "Profile",
        href: "/dashboard/profile",
        icon: UserCircle,
      },
      {
        name: "Hospital Bed Finder",
        href: "/hospitals",
        icon: Building2,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden cursor-default w-full h-full border-none p-0 outline-none"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white shadow-2xs transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Clean Logo Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-stone-200">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs group-hover:bg-red-700 transition-colors">
              <Siren className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-stone-900 flex items-center gap-1">
                PulseRescue
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                {isAdmin
                  ? "Admin Console"
                  : isDriver
                    ? "Driver Console"
                    : "Patient Portal"}
              </span>
            </div>
          </Link>

          {/* Close for mobile */}
          <button
            type="button"
            onClick={() => dispatch(setSidebarOpen(false))}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isExact = pathname === item.href;
            const isSubRoute =
              item.href !== "/admin" &&
              item.href !== "/provider" &&
              item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`);
            const isManageAlias =
              item.href === "/admin/manage" &&
              (pathname === "/admin/fleet" || pathname === "/admin/hospitals");
            const isActive = isExact || isSubRoute || isManageAlias;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={cn(
                  "group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors",
                  isActive
                    ? "bg-red-50 text-red-700 border border-red-200/80 shadow-2xs"
                    : "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-red-600"
                        : item.name === "Request SOS Ambulance"
                          ? "text-red-500 group-hover:text-red-600"
                          : "text-stone-400 group-hover:text-stone-700",
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md transition-colors",
                      isActive
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-700 group-hover:bg-red-200",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Clean Bottom Sign Out */}
        <div className="p-3 border-t border-stone-100">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="h-4 w-4 text-stone-400 group-hover:text-red-600" />
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] font-mono text-stone-400">Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
}
