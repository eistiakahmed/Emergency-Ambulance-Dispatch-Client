import React from "react";

const metrics = [
  { value: "< 8.4 Mins", label: "Average Paramedic Arrival Time" },
  { value: "99.8%", label: "Geospatial Auto-Match Accuracy" },
  { value: "48+", label: "Partnered Hospital ICU & ER Centers" },
  { value: "24/7/365", label: "National Operations Command" },
];

export function MetricsSection() {
  return (
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
  );
}
