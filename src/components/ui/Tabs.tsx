"use client";

import type React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  tabClassName,
}: TabsProps) {
  return (
    <div
      className={cn(
        "flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/80 gap-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200",
              isActive
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/60"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-50/50",
              tabClassName,
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                  isActive
                    ? "bg-red-100 text-red-700"
                    : "bg-stone-200 text-stone-600",
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
