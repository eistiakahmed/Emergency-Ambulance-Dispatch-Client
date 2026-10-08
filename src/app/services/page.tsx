import {
  Ambulance,
  Baby,
  Building2,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Services & Ambulance Tiers | PulseRescue",
  description:
    "Basic Life Support, Advanced Life Support, Neonatal ICU transport, and live hospital bed discovery.",
};

const services = [
  {
    icon: Ambulance,
    title: "Basic Life Support (BLS)",
    text: "Trained crews and essential equipment for stable patients and non-critical emergency transport.",
    points: [
      "Oxygen & first-aid equipment",
      "Stretcher transport",
      "Hospital-to-hospital transfers",
    ],
  },
  {
    icon: HeartPulse,
    title: "Advanced Life Support (ALS)",
    text: "ICU-grade units for critical patients, with cardiac monitoring and advanced airway support.",
    points: [
      "Cardiac monitor & defibrillator",
      "Ventilator support",
      "Critical care crew",
    ],
  },
  {
    icon: Baby,
    title: "Neonatal ICU Transport",
    text: "Specialised incubator-equipped ambulances for newborns who need intensive care in transit.",
    points: [
      "Transport incubator",
      "Neonatal monitoring",
      "Temperature-controlled cabin",
    ],
  },
  {
    icon: Building2,
    title: "Hospital Bed Discovery",
    text: "Search live ER and ICU bed availability across partner hospitals before you travel.",
    points: ["Live bed counts", "ICU filter & search", "Contact details"],
  },
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-360 w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Our Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Emergency care matched to the patient&apos;s need
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Choose the level of care your situation requires. Dispatch
            automatically selects the nearest available operational unit.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(({ icon: Icon, title, text, points }) => (
            <div
              key={title}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-base font-black tracking-tight">{title}</h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {text}
              </p>
              <ul className="space-y-1.5 text-xs text-stone-700 font-medium">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/emergency/new"
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/30 hover:bg-red-700 transition-colors"
          >
            Request an Ambulance
          </Link>
          <Link
            href="/hospitals"
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm font-semibold hover:bg-stone-50 transition-colors"
          >
            Find Hospital Beds
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
