import {
  Activity,
  Ambulance,
  ArrowRight,
  Check,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function FleetSection() {
  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="mx-auto max-w-384 px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
            Emergency Fleet Categories
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Every unit in our emergency network is equipped to handle clinical
            escalations with certified crews.
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
                  <Button
                    variant="outline"
                    className="w-full justify-between font-bold text-xs"
                  >
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
  );
}
