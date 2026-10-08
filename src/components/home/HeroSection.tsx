import { Building2, CheckCircle2, Siren } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-white min-h-145 lg:min-h-170 flex items-center">
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
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/85 to-transparent" />
        {/* Subtle bottom gradient to blend cleanly into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-linear-to-t from-stone-50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-384 w-full px-4 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.12]">
            Seconds Save Lives. <br />
            <span className="text-red-600">
              Rapid Ambulance Dispatch & Live ER Beds.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-700 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
            PulseRescue provides instant paramedic dispatch with live GPS
            tracking, intelligent nearest-unit matching, and real-time hospital
            ICU bed reservation.
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
  );
}
