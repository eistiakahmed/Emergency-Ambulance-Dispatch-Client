import React from "react";
import Link from "next/link";
import {
  Siren,
  PhoneCall,
  ShieldCheck,
  Clock,
  HeartPulse,
  Building2,
  Ambulance,
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CardGlass, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const fleetCategories = [
    {
      title: "Advanced Life Support (ALS)",
      description:
        "Equipped with ventilators, defibrillators, cardiac monitors, and certified emergency paramedics for critical trauma cases.",
      icon: HeartPulse,
      badge: "Critical Care",
      badgeVariant: "critical" as const,
      color: "from-red-500 to-rose-600",
    },
    {
      title: "Basic Life Support (BLS)",
      description:
        "Rapid response units for non-invasive medical transport, oxygen support, fracture stabilization, and immediate monitoring.",
      icon: Ambulance,
      badge: "Rapid Response",
      badgeVariant: "secondary" as const,
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Neonatal ICU Unit",
      description:
        "Specialized temperature-controlled transport incubators and pediatric life support systems for newborn critical care.",
      icon: Activity,
      badge: "Pediatric Specialized",
      badgeVariant: "warning" as const,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Initiate Emergency Triage",
      desc: "Tap the emergency dispatch button. Our system acquires your GPS coordinates and assesses priority triage immediately.",
    },
    {
      step: "02",
      title: "Geospatial Nearest Auto-Match",
      desc: "The dispatch algorithm pinpoints the closest available unit with verified equipment, transmitting the turn-by-turn route.",
    },
    {
      step: "03",
      title: "Hospital Bed Synchronization",
      desc: "Destination hospital receives live telemetry and prepares an emergency ICU/ER bay before the ambulance arrives.",
    },
  ];

  const metrics = [
    { value: "< 8.4 Mins", label: "Average Response Time" },
    { value: "99.8%", label: "Geospatial Match Accuracy" },
    { value: "48+", label: "Partnered Hospital ERs" },
    { value: "24/7/365", label: "Dedicated Dispatch Hub" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Top Emergency Notice Strip */}
        <div className="bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white py-2 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
          <span>NATIONAL EMERGENCY DISPATCH OPERATIONAL — 24/7 HOTLINE 999</span>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
          {/* Subtle Background Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[300px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300">
                  <Siren className="h-4 w-4 animate-bounce text-rose-600" />
                  <span>Next-Generation Medical Emergency Dispatch</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Seconds Count. <br />
                  <span className="bg-linear-to-r from-rose-600 via-red-500 to-amber-600 bg-clip-text text-transparent">
                    Rapid Ambulance Dispatch & Live ER Beds.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  PulseRescue coordinates live GPS ambulance tracking, automatic nearest unit matching, and real-time hospital ICU bed reservation in one seamless emergency command platform.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/dashboard/emergency/new" className="w-full sm:w-auto">
                    <Button
                      variant="emergency"
                      size="lg"
                      className="w-full sm:w-auto gap-2 text-base px-8 h-14"
                    >
                      <Siren className="h-5 w-5 animate-pulse" />
                      <span>Request Ambulance Now</span>
                    </Button>
                  </Link>

                  <Link href="/hospitals" className="w-full sm:w-auto">
                    <Button
                      variant="glass"
                      size="lg"
                      className="w-full sm:w-auto gap-2 text-base px-6 h-14"
                    >
                      <Building2 className="h-5 w-5 text-sky-600" />
                      <span>Find Available Beds</span>
                    </Button>
                  </Link>
                </div>

                {/* Live Telemetry Bar */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      24 Units On Active Standby
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-500" />
                    <span>Avg Dispatch Time: 48s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Verified Paramedic Crews</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Status Glass Widget */}
              <div className="lg:col-span-5">
                <CardGlass className="space-y-5 border-slate-200/80 shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse-dot" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Live Fleet Telemetry
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[11px]">
                      Dhaka Central Metro
                    </Badge>
                  </div>

                  {/* Active Unit Snippet */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center dark:bg-red-950 dark:text-red-400">
                          <Ambulance className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Unit #ALS-104 (ALS Critical)
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-rose-500" /> Dhanmondi Station
                          </p>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        Available
                      </Badge>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center dark:bg-sky-950 dark:text-sky-400">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Dhaka Medical ER Center
                          </p>
                          <p className="text-[11px] text-slate-500">
                            8 ICU Beds • 14 ER Bays Open
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        98% Capacity
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Evaluation Shortcut */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      Quick Evaluator Shortcut:
                    </p>
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        <span>Open 1-Click Demo Login Bar (Admin / Driver / Patient)</span>
                      </Button>
                    </Link>
                  </div>
                </CardGlass>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Counter Section */}
        <section className="border-y border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {metrics.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-black tracking-tight text-rose-600 dark:text-rose-400">
                    {m.value}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (3 Steps) */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <Badge variant="secondary">Deterministic Dispatch Process</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                How Emergency Response Operates
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                A high-speed finite state dispatch pipeline synchronizing patients, paramedics, and hospitals in under 60 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, idx) => (
                <CardGlass key={idx} className="relative space-y-4 p-8">
                  <span className="text-5xl font-black text-slate-200 dark:text-slate-800">
                    {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </CardGlass>
              ))}
            </div>
          </div>
        </section>

        {/* Ambulance Fleet Capabilities */}
        <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <Badge variant="default">Medical Fleet Standards</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Specialized Ambulance Fleet
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Every unit in our network is equipped to handle emergency clinical escalations with real-time biometric telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fleetCategories.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <Card key={idx} className="p-6 space-y-5 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div
                        className={`h-12 w-12 rounded-2xl bg-linear-to-tr ${f.color} text-white flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant={f.badgeVariant}>{f.badge}</Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {f.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {f.description}
                      </p>
                    </div>

                    <Link
                      href="/dashboard/emergency/new"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                    >
                      <span>Request Unit</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Emergency Call-To-Action Banner */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-linear-to-r from-red-600 via-rose-600 to-slate-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Immediate Medical Attention</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  In a Medical Emergency? Do Not Wait.
                </h2>
                <p className="text-sm sm:text-base text-rose-100 leading-relaxed">
                  Call our 24/7 central dispatch or submit an instant online SOS request. Our nearest unit will be immediately dispatched to your GPS location.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <a
                    href="tel:999"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-rose-600 font-bold text-sm shadow-lg hover:bg-rose-50 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Call Hotline 999</span>
                  </a>
                  <Link href="/dashboard/emergency/new">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      Online SOS Dispatch
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
