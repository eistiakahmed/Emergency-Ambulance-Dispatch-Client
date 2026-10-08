"use client";

import { ArrowRight, ScrollText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Pagination } from "@/components/dashboard/Pagination";
import { useAuditLogs } from "@/lib/hooks/useAdmin";
import { cn, formatFare } from "@/lib/utils";
import type { AuditLog } from "@/types";

const ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "STATUS_CHANGE",
  "DISPATCH",
  "PAYMENT",
];
const RESOURCES = [
  "USER",
  "TRIP",
  "PAYMENT",
  "HOSPITAL",
  "AMBULANCE",
  "EMERGENCY",
];

const selectClass =
  "h-10 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-700 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer";

function getStatusBadgeStyle(status: string) {
  const upper = String(status).toUpperCase();
  if (
    upper === "SUCCEEDED" ||
    upper === "COMPLETED" ||
    upper === "PAID" ||
    upper === "ACCEPTED" ||
    upper === "AVAILABLE"
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (
    upper === "PENDING" ||
    upper === "ASSIGNED" ||
    upper === "DISPATCHED" ||
    upper === "EN_ROUTE" ||
    upper === "BUSY"
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (
    upper === "FAILED" ||
    upper === "CANCELLED" ||
    upper === "REJECTED" ||
    upper === "OFFLINE"
  ) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-stone-100 text-stone-700 border-stone-200";
}

function ChangesSummary({ log }: { log: AuditLog }) {
  const newVals = log.newValues as Record<string, unknown> | null;
  const oldVals = log.oldValues as Record<string, unknown> | null;

  if (!newVals && !oldVals) {
    return <span className="text-stone-300">—</span>;
  }

  // Status transition detection
  const oldStatus = oldVals?.status ? String(oldVals.status) : null;
  const newStatus = newVals?.status ? String(newVals.status) : null;
  const isStatusTransition = oldStatus && newStatus && oldStatus !== newStatus;

  // Amount detection
  const amount =
    newVals?.amount !== undefined ? Number(newVals.amount) : undefined;
  const currency = (newVals?.currency as string) || "BDT";

  // Provider & Trx
  const provider = (newVals?.provider as string) || null;
  const trxId =
    (newVals?.trxID as string) || (newVals?.transactionId as string) || null;

  // Collect other key-value pairs
  const ignoredKeys = new Set([
    "status",
    "amount",
    "currency",
    "provider",
    "trxID",
    "transactionId",
    "bkashPaymentId",
    "stripeSessionId",
  ]);

  const otherEntries = Object.entries(newVals || {}).filter(
    ([k]) => !ignoredKeys.has(k),
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-0.5">
      {/* Status transition or single status */}
      {isStatusTransition ? (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded border",
              getStatusBadgeStyle(oldStatus),
            )}
          >
            {oldStatus}
          </span>
          <ArrowRight className="h-2.5 w-2.5 text-stone-400" />
          <span
            className={cn(
              "px-1.5 py-0.5 rounded border",
              getStatusBadgeStyle(newStatus),
            )}
          >
            {newStatus}
          </span>
        </span>
      ) : newStatus ? (
        <span
          className={cn(
            "px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase",
            getStatusBadgeStyle(newStatus),
          )}
        >
          {newStatus}
        </span>
      ) : null}

      {/* Amount badge */}
      {amount !== undefined && !Number.isNaN(amount) && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-800 font-semibold text-[10px]">
          {currency.toUpperCase() === "BDT"
            ? formatFare(amount, "bdt")
            : `${amount} ${currency}`}
        </span>
      )}

      {/* Provider badge */}
      {provider && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-stone-600 font-medium text-[10px]">
          {provider}
        </span>
      )}

      {/* Trx badge */}
      {trxId && (
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-stone-500 font-mono text-[10px]"
          title={`Transaction ID: ${trxId}`}
        >
          Trx: {trxId.length > 10 ? `${trxId.slice(0, 10)}…` : trxId}
        </span>
      )}

      {/* Other generic keys */}
      {otherEntries.slice(0, 3).map(([key, val]) => {
        const stringVal =
          typeof val === "object" ? JSON.stringify(val) : String(val);
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-stone-600 text-[10px]"
            title={`${key}: ${stringVal}`}
          >
            <span className="text-stone-400 font-medium">{key}:</span>
            <span className="font-semibold truncate max-w-[120px]">
              {stringVal}
            </span>
          </span>
        );
      })}

      {otherEntries.length > 3 && (
        <span className="text-[10px] text-stone-400 font-medium">
          +{otherEntries.length - 3} more
        </span>
      )}
    </div>
  );
}

export function AuditLogViewer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const action = searchParams.get("action") || undefined;
  const resourceType = searchParams.get("resourceType") || undefined;

  const { data, isLoading } = useAuditLogs({
    page,
    limit: 15,
    action,
    resourceType,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const logs: AuditLog[] = Array.isArray(data)
    ? (data as AuditLog[])
    : data?.data || [];
  const meta = Array.isArray(data) ? undefined : data?.meta;

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-stone-200 rounded-2xl shadow-2xs">
        <select
          value={action || ""}
          onChange={(e) => setFilter("action", e.target.value)}
          className={selectClass}
          aria-label="Filter by action"
        >
          <option value="">Action (All)</option>
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={resourceType || ""}
          onChange={(e) => setFilter("resourceType", e.target.value)}
          className={selectClass}
          aria-label="Filter by resource"
        >
          <option value="">Resource (All)</option>
          {RESOURCES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {logs.length === 0 && !isLoading ? (
        <EmptyState
          icon={ScrollText}
          title="No Audit Events"
          description="No events match the selected filters."
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/60 align-top">
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-stone-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] font-black uppercase">
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold">{log.resourceType}</span>
                      <span className="block font-mono text-[10px] text-stone-400">
                        {log.resourceId?.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">
                        {log.actor?.name || log.actorRole}
                      </span>
                      <span className="block text-[10px] text-stone-400">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 min-w-[220px]">
                      <ChangesSummary log={log} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className="p-4 border-t border-stone-100">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                limit={meta.limit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
