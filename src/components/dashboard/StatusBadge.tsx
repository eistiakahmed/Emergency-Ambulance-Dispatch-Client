import { cn } from "@/lib/utils";

export type EntityStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "DISPATCHED"
  | "EN_ROUTE"
  | "EN_ROUTE_PICKUP"
  | "PATIENT_PICKED_UP"
  | "EN_ROUTE_HOSPITAL"
  | "ARRIVED_HOSPITAL"
  | "HOSPITAL_ARRIVAL"
  | "COMPLETED"
  | "CANCELLED"
  | "AVAILABLE"
  | "BUSY"
  | "ON_TRIP"
  | "MAINTENANCE"
  | "OFFLINE"
  | "ONLINE"
  | "SUCCEEDED"
  | "PROCESSING"
  | "PAID"
  | "UNPAID"
  | "REFUNDED"
  | "LIMITED"
  | "FULL";

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dotColor?: string;
  hasPulse?: boolean;
}

const statusMap: Record<EntityStatus, StatusConfig> = {
  // Emergency / Trip Lifecycles
  PENDING: {
    label: "Pending Dispatch",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    hasPulse: true,
  },
  ASSIGNED: {
    label: "Ambulance Dispatched",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  ACCEPTED: {
    label: "Driver Assigned",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  DISPATCHED: {
    label: "Dispatched",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dotColor: "bg-indigo-500",
    hasPulse: true,
  },
  EN_ROUTE: {
    label: "En Route",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dotColor: "bg-purple-500",
    hasPulse: true,
  },
  EN_ROUTE_PICKUP: {
    label: "En Route to Pickup",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dotColor: "bg-indigo-500",
    hasPulse: true,
  },
  PATIENT_PICKED_UP: {
    label: "Patient Onboard",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dotColor: "bg-teal-500",
  },
  EN_ROUTE_HOSPITAL: {
    label: "En Route to ER",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dotColor: "bg-purple-500",
    hasPulse: true,
  },
  ARRIVED_HOSPITAL: {
    label: "At Hospital ER",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dotColor: "bg-cyan-500",
  },
  HOSPITAL_ARRIVAL: {
    label: "At Hospital ER",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dotColor: "bg-cyan-500",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dotColor: "bg-rose-400",
  },

  // Fleet & Driver Availability
  AVAILABLE: {
    label: "Available",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  ONLINE: {
    label: "Online / Ready",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  BUSY: {
    label: "Busy / On Call",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    hasPulse: true,
  },
  ON_TRIP: {
    label: "On Active Trip",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dotColor: "bg-blue-500",
    hasPulse: true,
  },
  MAINTENANCE: {
    label: "In Maintenance",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
    dotColor: "bg-stone-400",
  },
  OFFLINE: {
    label: "Offline",
    bg: "bg-stone-100",
    text: "text-stone-500",
    border: "border-stone-200",
    dotColor: "bg-stone-400",
  },

  // Bed Availability
  LIMITED: {
    label: "Limited Beds",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  FULL: {
    label: "Fully Occupied",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dotColor: "bg-red-500",
  },

  // Payment
  SUCCEEDED: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  PROCESSING: {
    label: "Processing",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dotColor: "bg-blue-500",
    hasPulse: true,
  },
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  UNPAID: {
    label: "Payment Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  REFUNDED: {
    label: "Refunded",
    bg: "bg-stone-100",
    text: "text-stone-600",
    border: "border-stone-200",
  },
};

export interface StatusBadgeProps {
  status: EntityStatus | string;
  customLabel?: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  customLabel,
  className,
  size = "md",
}: StatusBadgeProps) {
  const normalized = (status?.toUpperCase() || "PENDING") as EntityStatus;
  const config = statusMap[normalized] || {
    label: status || "Unknown",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-200",
    dotColor: "bg-stone-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold border tracking-wide uppercase",
        config.bg,
        config.text,
        config.border,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      {config.dotColor && (
        <span className="relative flex h-1.5 w-1.5">
          {config.hasPulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                config.dotColor,
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              config.dotColor,
            )}
          />
        </span>
      )}
      <span>{customLabel || config.label}</span>
    </span>
  );
}
