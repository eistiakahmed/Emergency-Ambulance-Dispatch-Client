import React from "react";
import Link from "next/link";
import { Siren, Phone, Mail, MapPin, ShieldCheck, HeartPulse } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-900 text-slate-300 dark:border-slate-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-rose-600 to-red-500 text-white shadow-lg">
                <Siren className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                PulseRescue
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Enterprise-grade emergency medical dispatch network. Connecting patients with verified ICU/ALS ambulances, emergency hospital bed tracking, and rapid geospatial routing.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>HIPAA Compliant & ISO 27001 Certified Security</span>
            </div>
          </div>

          {/* Emergency Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Emergency Fleet
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Advanced Life Support (ALS)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Basic Life Support (BLS)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Neonatal ICU Transport
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-white transition-colors">
                  Live Hospital Bed Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  1-Click Role Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Driver Onboarding
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dispatch Console
                </Link>
              </li>
              <li>
                <Link href="/provider" className="hover:text-white transition-colors">
                  Provider Shift Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & 24/7 Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              24/7 Operations
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-rose-500 shrink-0" />
                <span className="font-bold text-white">999 / 911 (Emergency)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <span>dispatch@emergency.com</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>National Emergency Operations Hub, Central Station</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PulseRescue Emergency Dispatch Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-300">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Security Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
