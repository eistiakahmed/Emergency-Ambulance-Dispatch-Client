import type React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const metadata = {
  title: "Patient Dashboard | PulseRescue EMS",
  description:
    "Patient emergency care portal with instant 1-tap ambulance booking, active trip driver ETA tracking, and hospital bed discovery.",
};

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
