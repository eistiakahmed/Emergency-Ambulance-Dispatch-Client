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

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="mx-auto max-w-384 px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
            How Emergency Response Operates
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            A high-speed dispatch pipeline synchronizing patients, paramedics,
            and trauma hospitals in under 60 seconds.
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
              <p className="text-sm text-stone-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
