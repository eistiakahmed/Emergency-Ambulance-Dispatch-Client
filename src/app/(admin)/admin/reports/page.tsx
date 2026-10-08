import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";

export const metadata: Metadata = {
  title: "Audit Logs & Governance | PulseRescue Admin",
  description: "Immutable trail of dispatches, status changes, and payments.",
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Audit Logs &amp; Governance
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Immutable record of every dispatch, status change, and payment event.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse p-6" />
        }
      >
        <AuditLogViewer />
      </Suspense>
    </div>
  );
}
