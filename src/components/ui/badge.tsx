import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-red-600 text-white shadow-xs",
        redSubtle: "bg-red-50 text-red-700 border border-red-200",
        warm: "bg-stone-100 text-stone-800 border border-stone-200",
        warmDark: "bg-stone-900 text-stone-100",
        amber: "bg-amber-50 text-amber-900 border border-amber-200",
        outline: "border border-stone-300 text-stone-700 bg-white",
        critical:
          "bg-red-600 text-white animate-pulse shadow-sm shadow-red-500/50",
      },
    },
    defaultVariants: {
      variant: "warm",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-beacon" />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
