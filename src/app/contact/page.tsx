import { Mail, MapPin, PhoneCall } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Contact & Emergency Hotline | PulseRescue",
  description: "24/7 emergency dispatch contact details and inquiry form.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-360 w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="space-y-2 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            In an emergency, call the hotline immediately. Use the form below
            for non-urgent questions.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="space-y-4">
            <a
              href="tel:999"
              className="flex items-center gap-3 rounded-2xl bg-red-600 text-white p-5 shadow-lg shadow-red-600/30 hover:bg-red-700 transition-colors"
            >
              <PhoneCall className="h-6 w-6" />
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-red-100">
                  24/7 Emergency Hotline
                </span>
                <span className="text-xl font-black">999</span>
              </div>
            </a>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs space-y-3 text-sm text-stone-700">
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-stone-400 shrink-0" />
                <a
                  href="mailto:dispatch@emergency.com"
                  className="hover:text-red-600"
                >
                  dispatch@emergency.com
                </a>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                <span>Central Operations Command Station</span>
              </p>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
