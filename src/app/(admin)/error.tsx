"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-stone-200 bg-white space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-bold text-stone-900">
          Admin Command Center Failed to Load
        </h2>
        <p className="text-xs text-stone-500 max-w-sm">
          {error.message || "An unexpected error occurred while loading dispatch telemetry."}
        </p>
      </div>
      <Button
        variant="emergency"
        size="sm"
        onClick={() => reset()}
        className="text-xs font-bold gap-1.5"
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        <span>Retry Loading</span>
      </Button>
    </div>
  );
}
