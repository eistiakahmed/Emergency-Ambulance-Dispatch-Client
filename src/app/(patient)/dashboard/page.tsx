import React from "react";
import type { Metadata } from "next";
import { PatientOverview } from "@/components/patient/PatientOverview";

export const metadata: Metadata = {
  title: "Patient Emergency Dashboard | PulseRescue",
  description:
    "Instant emergency ambulance dispatch, active trip live tracking, and hospital bed reservation portal.",
};

export default function PatientDashboardPage() {
  return <PatientOverview />;
}
