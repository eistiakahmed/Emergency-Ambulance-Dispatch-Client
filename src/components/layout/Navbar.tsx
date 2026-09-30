"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Siren,
  PhoneCall,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
    { name: "Fleet & Services", href: "/services" },
    { name: "Hospital Beds", href: "/hospitals" },
    { name: "About Network", href: "/about" },
    { name: "Contact & Hubs", href: "/contact" },
  ];

  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "DRIVER") return "/provider";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white shadow-xs">
      {/* Top Urgent Emergency Alert Bar */}
      <div className="bg-red-600 text-white py-1.5 px-4 text-xs font-bold tracking-wide text-center flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-white animate-beacon" />
        <span>24/7 NATIONAL EMERGENCY AMBULANCE DISPATCH • HOTLINE 999</span>
      </div>

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Web Name & Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/25 group-hover:bg-red-700 transition-colors">
              <Siren className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                PulseRescue
                <span className="inline-block h-2 w-2 rounded-full bg-red-600" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                Emergency Command
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-700 font-bold"
                    : "text-stone-700 hover:text-red-600 hover:bg-stone-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:999"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors text-xs font-bold"
          >
            <PhoneCall className="h-3.5 w-3.5 text-red-600" />
            <span>999 HOTLINE</span>
          </a>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link href={getDashboardHref()}>
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold">
                  <LayoutDashboard className="h-4 w-4 text-red-600" />
                  <span>
                    {user.role === "ADMIN"
                      ? "Admin Console"
                      : user.role === "DRIVER"
                      ? "Driver Console"
                      : "Patient Portal"}
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="iconSm"
                onClick={handleLogout}
                title="Sign Out"
                className="text-stone-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard/emergency/new">
                <Button variant="emergency" size="sm" className="gap-1.5 text-xs font-bold">
                  <Siren className="h-4 w-4" />
                  <span>Request SOS</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Tablet & Mobile: Icon Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="tel:999"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs shadow-xs"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>999</span>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 border border-stone-200"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-red-600" />
            ) : (
              <Menu className="h-6 w-6 text-stone-800" />
            )}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "bg-red-50 text-red-700 font-bold"
                    : "text-stone-800 hover:bg-stone-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <Link
              href="/dashboard/emergency/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button variant="emergency" className="w-full justify-center gap-2 font-bold">
                <Siren className="h-4 w-4" />
                <span>Request Immediate Ambulance</span>
              </Button>
            </Link>

            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full justify-center font-bold">
                    Go to Dashboard Console
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center text-red-600 font-bold"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="warm" className="w-full font-bold">
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
