import type { Metadata } from "next";
import { Suspense } from "react";
import { PatientTripDetailsView } from "@/components/patient/PatientTripDetailsView";

export const metadata: Metadata = {
  title: "Trip Details & Billing Statement | PulseRescue",
  description:
    "Detailed emergency ambulance dispatch report, route GPS log, and digital payment settlement.",
};

export default async function PatientTripDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto py-8 space-y-4">
            <div className="h-8 w-48 rounded-lg bg-stone-200 animate-pulse" />
            <div className="h-96 rounded-3xl bg-stone-100 animate-pulse" />
          </div>
        }
      >
        <PatientTripDetailsView id={id} />
      </Suspense>
    </div>
  );
}
