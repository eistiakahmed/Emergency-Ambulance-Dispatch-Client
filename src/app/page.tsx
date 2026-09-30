import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { MetricsSection } from "@/components/home/MetricsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FleetSection } from "@/components/home/FleetSection";
import { FaqSection } from "@/components/home/FaqSection";
import { EmergencyCtaSection } from "@/components/home/EmergencyCtaSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Key Metrics & Stats */}
        <MetricsSection />

        {/* 3. SOP & Dispatch Workflow Steps */}
        <HowItWorksSection />

        {/* 4. Specialized Ambulance Fleet Categories */}
        <FleetSection />

        {/* 5. Interactive FAQ Accordion */}
        <FaqSection />

        {/* 6. Emergency Callout Hotline Banner */}
        <EmergencyCtaSection />
      </main>

      <Footer />
    </div>
  );
}
