import { type LucideIcon, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    label?: string;
    direction?: "up" | "down" | "neutral";
  };
  variant?: "default" | "red" | "emerald" | "amber" | "blue" | "stone";
  className?: string;
  loading?: boolean;
}

const variantStyles = {
  default: {
    card: "border-stone-200 bg-white hover:border-stone-300",
    iconBg: "bg-stone-100 text-stone-700",
    valueText: "text-stone-900",
  },
  red: {
    card: "border-red-100 bg-white hover:border-red-300 shadow-xs",
    iconBg: "bg-red-50 text-red-600 border border-red-100",
    valueText: "text-red-700",
  },
  emerald: {
    card: "border-emerald-100 bg-white hover:border-emerald-300 shadow-xs",
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    valueText: "text-emerald-700",
  },
  amber: {
    card: "border-amber-100 bg-white hover:border-amber-300 shadow-xs",
    iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    valueText: "text-amber-700",
  },
  blue: {
    card: "border-blue-100 bg-white hover:border-blue-300 shadow-xs",
    iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    valueText: "text-blue-700",
  },
  stone: {
    card: "border-stone-200 bg-white hover:border-stone-400 shadow-2xs",
    iconBg: "bg-stone-100 text-stone-800 border border-stone-200",
    valueText: "text-stone-900",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
  loading = false,
}: StatCardProps) {
  const styles = variantStyles[variant];

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-2xl border p-5 bg-white space-y-3 animate-pulse",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-stone-200 rounded-md" />
          <div className="h-10 w-10 bg-stone-200 rounded-xl" />
        </div>
        <div className="h-8 w-20 bg-stone-200 rounded-md" />
        <div className="h-3 w-32 bg-stone-100 rounded-md" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-200",
        styles.card,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {title}
        </span>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
            styles.iconBg,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={cn(
            "text-2xl sm:text-3xl font-black tracking-tight",
            styles.valueText,
          )}
        >
          {value}
        </span>

        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md",
              trend.direction === "up"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : trend.direction === "down"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-stone-100 text-stone-600 border border-stone-200",
            )}
          >
            {trend.direction === "up" && <TrendingUp className="h-3 w-3" />}
            {trend.direction === "down" && <TrendingDown className="h-3 w-3" />}
            {trend.direction === "neutral" && <Minus className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-stone-500">{description}</p>
      )}
    </div>
  );
}
