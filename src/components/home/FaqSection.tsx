"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, PhoneCall, ArrowRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    question: "How fast does an emergency ambulance get dispatched?",
    answer:
      "Our automated dispatch engine matches and assigns the closest verified ambulance via real-time GPS telemetry in under 60 seconds. The average arrival time across our metro partner network is less than 8.4 minutes.",
    category: "Dispatch & Response",
  },
  {
    question: "What is the difference between ALS and BLS ambulances?",
    answer:
      "Advanced Life Support (ALS) units are mobile ICUs equipped with mechanical ventilators, defibrillators, cardiac monitoring, and certified trauma paramedics. Basic Life Support (BLS) units handle non-invasive emergencies with continuous oxygen therapy, splinting, and rapid medical transport.",
    category: "Fleet Capabilities",
  },
  {
    question: "How does real-time hospital bed reservation work?",
    answer:
      "While the ambulance is en route, patient vitals and triage priority are automatically synchronized with the receiving hospital. The emergency department prepares an ICU or ER bay in advance, eliminating handover wait times upon arrival.",
    category: "Hospital Coordination",
  },
  {
    question: "Can I track the dispatched ambulance in real-time?",
    answer:
      "Yes. Once a unit is dispatched, you gain access to live turn-by-turn map tracking with exact GPS coordinates, paramedic team contacts, and dynamic ETA updates updated every 3 seconds.",
    category: "Live Tracking",
  },
  {
    question: "What payment methods are supported for emergency dispatch?",
    answer:
      "We support secure digital payments through Stripe, bKash Merchant, Visa/Mastercard, and mobile banking. Digital invoices with transparent distance-fare breakdowns and official medical receipt PDFs are automatically generated.",
    category: "Payments & Billing",
  },
  {
    question: "Is PulseRescue emergency service operational 24/7?",
    answer:
      "Yes. Our central operations command, paramedic stations, and toll-free emergency hotlines (999 / 911) operate 24 hours a day, 7 days a week, 365 days a year without interruption.",
    category: "Availability",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Badge variant="redSubtle">Common Questions & Guidance</Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Everything you need to know about emergency dispatch protocols, fleet capabilities, bed reservation, and response times.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive FAQ Accordion */}
          <div className="lg:col-span-8 space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-200 bg-white shadow-xs overflow-hidden ${
                    isOpen
                      ? "border-red-600/60 ring-1 ring-red-600/10"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4 transition-colors hover:bg-stone-50/60"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          isOpen
                            ? "bg-red-600 text-white"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-stone-900">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-red-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/40 animate-in fade-in duration-150">
                      <p className="pl-10">{faq.answer}</p>
                      <div className="pl-10 pt-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: 24/7 Support & Direct Hotline Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/25">
                <HelpCircle className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-stone-900">
                  Still have questions?
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Our emergency triage operators and dispatch specialists are on duty 24/7 to assist with urgent inquiries.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-stone-100">
                <a
                  href="tel:999"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-md hover:bg-red-700 transition-colors"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Emergency (999)</span>
                </a>

                <Link href="/contact" className="block w-full">
                  <Button variant="outline" className="w-full justify-center gap-2 font-bold text-xs h-11">
                    <MessageSquare className="h-4 w-4" />
                    <span>Contact Operations Hub</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stat Pill */}
            <div className="rounded-2xl border border-stone-200 bg-stone-100/70 p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Response Reliability
              </p>
              <p className="text-2xl font-black text-stone-900">
                99.98% <span className="text-xs font-semibold text-stone-600">Dispatch Uptime</span>
              </p>
              <p className="text-xs text-stone-500">
                Automated failover redundant servers across major telecom networks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
