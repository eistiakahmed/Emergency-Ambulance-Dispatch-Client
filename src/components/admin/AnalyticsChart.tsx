"use client";

import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const HOURLY_DISPATCH_DATA = [
  { hour: "00:00", calls: 4, responseMin: 6.2 },
  { hour: "03:00", calls: 2, responseMin: 5.8 },
  { hour: "06:00", calls: 7, responseMin: 7.1 },
  { hour: "09:00", calls: 14, responseMin: 8.5 },
  { hour: "12:00", calls: 18, responseMin: 9.1 },
  { hour: "15:00", calls: 16, responseMin: 8.2 },
  { hour: "18:00", calls: 21, responseMin: 9.8 },
  { hour: "21:00", calls: 11, responseMin: 7.0 },
];

export function AnalyticsChart() {
  const [activeMetric, setActiveMetric] = useState<"calls" | "response">(
    "calls",
  );

  const maxCalls = Math.max(...HOURLY_DISPATCH_DATA.map((d) => d.calls));
  const maxResponse = Math.max(
    ...HOURLY_DISPATCH_DATA.map((d) => d.responseMin),
  );

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-6">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-red-600" />
            <h3 className="text-base font-bold text-stone-900">
              Dispatch Analytics & Incident Response Trends
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            24-hour rolling emergency call volume and ambulance arrival response
            times.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveMetric("calls")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeMetric === "calls"
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900",
            )}
          >
            Emergency Volume
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("response")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeMetric === "response"
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900",
            )}
          >
            Response Time (Min)
          </button>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="space-y-2">
        <div className="h-44 sm:h-52 flex items-end justify-between gap-2 pt-6 px-2">
          {HOURLY_DISPATCH_DATA.map((item) => {
            const heightPercent =
              activeMetric === "calls"
                ? (item.calls / maxCalls) * 100
                : (item.responseMin / maxResponse) * 100;

            return (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              >
                {/* Tooltip value */}
                <span className="text-[10px] font-mono font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {activeMetric === "calls"
                    ? `${item.calls} calls`
                    : `${item.responseMin}m`}
                </span>

                {/* Animated bar */}
                <div
                  style={{ height: `${Math.max(heightPercent, 12)}%` }}
                  className={cn(
                    "w-full max-w-10 rounded-t-xl transition-all duration-300 group-hover:brightness-110",
                    activeMetric === "calls"
                      ? "bg-linear-to-t from-red-600 to-rose-400 group-hover:shadow-md group-hover:shadow-red-500/20"
                      : "bg-linear-to-t from-emerald-600 to-teal-400 group-hover:shadow-md group-hover:shadow-emerald-500/20",
                  )}
                />

                {/* X-axis label */}
                <span className="text-[10px] font-semibold text-stone-400 mt-1">
                  {item.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100 text-xs">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 text-[10px] font-bold uppercase">
            Peak Demand Window
          </span>
          <p className="font-bold text-stone-900 mt-0.5">
            18:00 - 21:00 (Evening)
          </p>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 text-[10px] font-bold uppercase">
            Average Response Time
          </span>
          <p className="font-bold text-emerald-700 mt-0.5">
            7.7 Minutes (Within Target)
          </p>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 text-[10px] font-bold uppercase">
            Triage Success SLA
          </span>
          <p className="font-bold text-blue-700 mt-0.5">
            99.4% Critical Survival Rate
          </p>
        </div>
      </div>
    </div>
  );
}
