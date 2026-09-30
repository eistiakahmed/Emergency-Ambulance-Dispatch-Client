import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Siren,
  PhoneCall,
  HeartPulse,
  Building2,
  Ambulance,
  Activity,
  ArrowRight,
  CheckCircle2,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const fleetCategories = [
    {
      title: "Advanced Life Support (ALS)",
      subtitle: "For Critical Trauma, Cardiac & Respiratory Emergencies",
      specs: [
        "Invasive Ventilator & Defibrillator",
        "Multi-parameter ECG & Cardiac Monitor",
        "Certified Paramedic & Critical Care Nurse",
        "Emergency Resuscitation Medications",
      ],
      icon: HeartPulse,
      badge: "Critical Care",
      badgeVariant: "critical" as const,
    },
    {
      title: "Basic Life Support (BLS)",
      subtitle: "Rapid First-Response & Non-Invasive Medical Transport",
      specs: [
        "Continuous Oxygen Therapy System",
        "Spine Board & Fracture Immobilization",
        "Automated External Defibrillator (AED)",
        "Certified Emergency Medical Responder",
      ],
      icon: Ambulance,
      badge: "Rapid Response",
      badgeVariant: "redSubtle" as const,
    },
    {
      title: "Neonatal & Pediatric ICU",
      subtitle: "Specialized Incubator Care for Newborns & Infants",
      specs: [
        "Temperature-Controlled Transport Incubator",
        "Neonatal Specialized Mechanical Ventilator",
        "Pediatric Emergency Drug Delivery",
        "Pediatric Intensive Care Specialist",
      ],
      icon: Activity,
      badge: "Pediatric Specialized",
      badgeVariant: "amber" as const,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Instant SOS Request",
      desc: "Tap the emergency dispatch button. Our system acquires your GPS coordinates and assesses priority triage immediately.",
    },
    {
      step: "02",
      title: "Geospatial Nearest Match",
      desc: "The nearest available ambulance is automatically assigned and dispatched with turn-by-turn routing under 60 seconds.",
    },
    {
      step: "03",
      title: "Hospital ER Synchronization",
      desc: "Destination trauma hospital receives real-time telemetry and readies an ICU/ER bay before ambulance arrival.",
    },
  ];

  const metrics = [
    { value: "< 8.4 Mins", label: "Average Paramedic Arrival Time" },
    { value: "99.8%", label: "Geospatial Auto-Match Accuracy" },
    { value: "48+", label: "Partnered Hospital ICU & ER Centers" },
    { value: "24/7/365", label: "National Operations Command" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Full-Width Background Image & Clean Left Overlay */}
        <section className="relative overflow-hidden border-b border-stone-200 bg-white min-h-[580px] lg:min-h-[680px] flex items-center">
          {/* Full-width Background Image Layer */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image
              src="/image.png"
              alt="Emergency Ambulance Dispatch Fleet & Paramedics"
              fill
              priority
              quality={95}
              className="object-cover object-right lg:object-center"
            />
            {/* Smooth Left-to-Right White Fade Overlay for High Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-white/75 to-transparent lg:via-white/85 lg:to-transparent/10" />
            {/* Subtle bottom gradient to blend cleanly into the next section */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-stone-50 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1536px] w-full px-4 sm:px-8 lg:px-12 py-16 lg:py-24">
            <div className="max-w-2xl lg:max-w-3xl space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50/90 border border-red-200/80 text-red-700 text-xs font-bold shadow-xs backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-beacon" />
                <span>24/7 Nationwide Emergency Medical Dispatch</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.12]">
                Seconds Save Lives. <br />
                <span className="text-red-600">
                  Rapid Ambulance Dispatch & Live ER Beds.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-700 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
                PulseRescue provides instant paramedic dispatch with live GPS tracking, intelligent nearest-unit matching, and real-time hospital ICU bed reservation.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/dashboard/emergency/new" className="w-full sm:w-auto">
                  <Button
                    variant="emergency"
                    size="lg"
                    className="w-full sm:w-auto gap-2.5 text-sm sm:text-base px-8 h-13 shadow-lg shadow-red-600/30 font-bold"
                  >
                    <Siren className="h-5 w-5" />
                    <span>Request Immediate Ambulance</span>
                  </Button>
                </Link>

                <Link href="/hospitals" className="w-full sm:w-auto">
                  <Button
                    variant="warm"
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-sm sm:text-base px-7 h-13 font-bold"
                  >
                    <Building2 className="h-5 w-5" />
                    <span>Find Hospital Beds</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Points */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs font-bold text-stone-700">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/70 shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-red-600" />
                  <span>Dispatch Under 60s</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/70 shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-red-600" />
                  <span>Certified Paramedics</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/70 shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-red-600" />
                  <span>Real-Time ER Sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Stats Metrics */}
        <section className="border-b border-stone-200 bg-stone-50 py-10 sm:py-12">
          <div className="mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 text-center space-y-1 shadow-xs"
                >
                  <p className="text-2xl sm:text-4xl font-black tracking-tight text-red-600">
                    {m.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-stone-600">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (3 Steps) */}
        <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
          <div className="mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
              <Badge variant="redSubtle">Standard Operating Procedure</Badge>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
                How Emergency Response Operates
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                A high-speed dispatch pipeline synchronizing patients, paramedics, and trauma hospitals in under 60 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="relative rounded-3xl border border-stone-200 bg-stone-50/80 p-6 sm:p-8 space-y-4 hover:border-stone-300 transition-colors"
                >
                  <span className="text-4xl sm:text-5xl font-black text-stone-200">
                    {s.step}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                    {s.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Fleet Capabilities */}
        <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
          <div className="mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
              <Badge variant="warm">Medical Fleet Standards</Badge>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
                Emergency Fleet Categories
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Every unit in our emergency network is equipped to handle clinical escalations with certified crews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {fleetCategories.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 space-y-5 sm:space-y-6 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20">
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant={f.badgeVariant}>{f.badge}</Badge>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                          {f.title}
                        </h3>
                        <p className="text-xs font-semibold text-stone-500">
                          {f.subtitle}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        {f.specs.map((spec, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center gap-2 text-xs text-stone-700 font-medium"
                          >
                            <Check className="h-4 w-4 text-red-600 shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/dashboard/emergency/new" className="pt-2 sm:pt-4">
                      <Button variant="outline" className="w-full justify-between font-bold text-xs">
                        <span>Dispatch This Unit</span>
                        <ArrowRight className="h-4 w-4 text-red-600" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Emergency Call-To-Action Banner */}
        <section className="py-14 sm:py-20 bg-white">
          <div className="mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-12">
            <div className="rounded-3xl bg-stone-900 text-white p-7 sm:p-14 overflow-hidden shadow-2xl border border-stone-800">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-xs font-bold text-white">
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Immediate Medical Attention</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                  In a Medical Emergency? Do Not Wait.
                </h2>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Call our 24/7 central dispatch hotline directly or submit an instant online SOS request for immediate nearest ambulance dispatch.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <a
                    href="tel:999"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Call Hotline 999</span>
                  </a>
                  <Link href="/dashboard/emergency/new">
                    <Button
                      variant="outline"
                      className="bg-transparent border-stone-700 text-white hover:bg-stone-800 hover:text-white"
                    >
                      Online Emergency Request
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
