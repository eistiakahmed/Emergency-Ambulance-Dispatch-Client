import { Mail, MapPin, Phone, ShieldCheck, Siren } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-384 px-4 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                <Siren className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                PulseRescue
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Enterprise emergency medical dispatch network. Connecting patients
              with verified ICU/ALS ambulances, emergency hospital bed tracking,
              and rapid geospatial routing.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-stone-400 font-semibold">
              <ShieldCheck className="h-4 w-4 text-red-500" />
              <span>24/7 Verified Emergency Operations Command</span>
            </div>
          </div>

          {/* Emergency Fleet */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency Fleet
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Advanced Life Support (ALS)
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Basic Life Support (BLS)
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Neonatal ICU Transport
                </Link>
              </li>
              <li>
                <Link
                  href="/hospitals"
                  className="hover:text-white transition-colors"
                >
                  Live Hospital Bed Finder
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  1-Click Role Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Driver Onboarding
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  Admin Dispatch Console
                </Link>
              </li>
              <li>
                <Link
                  href="/provider"
                  className="hover:text-white transition-colors"
                >
                  Provider Shift Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              24/7 Hotline
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-red-500 shrink-0" />
                <span className="font-bold text-white text-base">
                  999 / 911 (Toll-Free)
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-stone-400 shrink-0" />
                <span>dispatch@emergency.com</span>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                <span>Central Operations Command Station</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} PulseRescue Emergency Dispatch Network.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-stone-300">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-stone-300">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-stone-300">
              Security Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
