import React from "react";
import type { Metadata } from "next";
import { DriverConsole } from "@/components/driver/DriverConsole";

export const metadata: Metadata = {
  title: "Driver EMS Console | PulseRescue",
  description:
    "Ambulance driver emergency dispatch cockpit, shift management, live patient milestone tracking, and hospital navigation.",
};

export default function DriverProviderPage() {
  return <DriverConsole />;
}
