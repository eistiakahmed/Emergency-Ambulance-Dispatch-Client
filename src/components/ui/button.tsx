import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-red-600 text-white shadow-md hover:bg-red-700 active:bg-red-800 shadow-red-600/20",
        emergency:
          "bg-red-600 text-white font-bold shadow-lg shadow-red-600/30 hover:bg-red-700 hover:shadow-red-600/40",
        warm: "bg-stone-900 text-stone-50 shadow-sm hover:bg-stone-800 active:bg-stone-950",
        secondary:
          "bg-stone-100 text-stone-900 border border-stone-200 hover:bg-stone-200 active:bg-stone-300",
        outline:
          "border border-stone-300 bg-white text-stone-800 shadow-xs hover:bg-stone-50 hover:border-stone-400",
        ghost: "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        link: "text-red-600 underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-xl px-7 text-base",
        icon: "h-10 w-10 p-0 rounded-xl",
        iconSm: "h-8 w-8 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
