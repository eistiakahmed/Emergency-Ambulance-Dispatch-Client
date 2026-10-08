import type React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const metadata = {
  title: "Admin Executive Dispatch Command | PulseRescue EMS",
  description:
    "Enterprise management console for live ambulance dispatch, fleet telemetry, hospital ER bed allocation, and analytics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
