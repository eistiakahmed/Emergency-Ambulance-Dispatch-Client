import { EmergencyCtaSection } from "@/components/home/EmergencyCtaSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FleetSection } from "@/components/home/FleetSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { MetricsSection } from "@/components/home/MetricsSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

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
