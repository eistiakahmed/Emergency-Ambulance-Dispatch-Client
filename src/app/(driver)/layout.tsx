import type React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const metadata = {
  title: "Driver Telemetry & Dispatch Console | PulseRescue EMS",
  description:
    "Mobile-friendly operational driver terminal with shift status switcher, GPS beacon, and milestone action controls.",
};

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
