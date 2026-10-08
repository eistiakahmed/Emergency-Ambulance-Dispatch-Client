import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmergencyCtaSection() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="mx-auto max-w-384 px-4 sm:px-8 lg:px-12">
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
              Call our 24/7 central dispatch hotline directly or submit an
              instant online SOS request for immediate nearest ambulance
              dispatch.
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
                  className="bg-transparent border-stone-700 text-white hover:bg-stone-800 hover:text-white font-bold"
                >
                  Online Emergency Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
