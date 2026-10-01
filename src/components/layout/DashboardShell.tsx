"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardShellProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  children: React.ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  onRefresh,
  isRefreshing,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased flex flex-col">
      <DashboardSidebar />
      <div className="flex flex-col lg:pl-64 min-h-screen">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
