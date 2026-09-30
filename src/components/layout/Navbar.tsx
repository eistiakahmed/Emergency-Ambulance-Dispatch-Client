"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Siren,
  PhoneCall,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Shield,
  Activity,
  Ambulance,
  LayoutDashboard,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      toast.success("Successfully signed out");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Hospital Beds", href: "/hospitals" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "DRIVER") return "/provider";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 transition-all">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-rose-600 to-red-500 text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <Siren className="h-6 w-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              PulseRescue
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Emergency Dispatch
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Emergency 24/7 Hotline Badge */}
          <a
            href="tel:999"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200/80 hover:bg-red-100 transition-colors text-xs font-bold dark:bg-red-950/50 dark:text-red-300 dark:border-red-900"
          >
            <PhoneCall className="h-3.5 w-3.5 text-red-600 animate-bounce" />
            <span>24/7 HOTLINE: 999</span>
          </a>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link href={getDashboardHref()}>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4 text-rose-600" />
                  <span>
                    {user.role === "ADMIN"
                      ? "Admin Console"
                      : user.role === "DRIVER"
                      ? "Driver Console"
                      : "My Dashboard"}
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="iconSm"
                onClick={handleLogout}
                title="Sign Out"
                className="text-slate-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard/emergency/new">
                <Button variant="emergency" size="sm" className="gap-1.5">
                  <Activity className="h-4 w-4" />
                  <span>Dispatch Now</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/dashboard/emergency/new">
            <Button variant="emergency" size="sm" className="px-3 text-xs">
              SOS
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium ${
                  pathname === link.href
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <a
              href="tel:999"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-md"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Emergency (999)</span>
            </a>

            {isAuthenticated && user ? (
              <div className="space-y-2 pt-2">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block"
                >
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-red-600"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="default" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
