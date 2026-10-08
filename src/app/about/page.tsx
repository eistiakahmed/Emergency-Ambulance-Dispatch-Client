import {
  Activity,
  Building2,
  Clock,
  MapPin,
  ShieldCheck,
  Siren,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "About Us | PulseRescue",
  description:
    "Our mission, rapid response standards, and the medical partner network behind PulseRescue emergency dispatch.",
};

const standards = [
  {
    icon: Clock,
    title: "Rapid Dispatch",
    text: "Requests are triaged by priority and matched to the nearest available unit using live GPS distance.",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    text: "Patients follow the ambulance in real time with distance and ETA from the dispatch engine.",
  },
  {
    icon: Activity,
    title: "Hospital Readiness",
    text: "Live ER and ICU bed counts help route patients to a facility that can admit them.",
  },
  {
    icon: ShieldCheck,
    title: "Full Accountability",
    text: "Every dispatch, status change, and payment is recorded in an immutable audit trail.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-360 w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider">
            <Siren className="h-3.5 w-3.5" />
            <span>About PulseRescue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Getting the right ambulance to the right patient, faster.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            PulseRescue connects patients, ambulance drivers, and dispatchers on
            a single platform. Our mission is to cut the time between an
            emergency call and professional care by automating triage,
            nearest-unit matching, and hospital bed discovery.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight">
            Rapid Response Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {standards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs space-y-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight">
                Medical Partner Network
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                We work with certified hospitals that publish live emergency and
                ICU capacity, so crews can deliver patients where beds are
                actually available.
              </p>
            </div>
          </div>
          <Link
            href="/hospitals"
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-stone-900 text-stone-50 text-sm font-semibold hover:bg-stone-800 transition-colors shrink-0"
          >
            Browse Partner Hospitals
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
