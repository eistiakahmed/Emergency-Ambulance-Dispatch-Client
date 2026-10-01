import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, prefixIcon, rightIcon, ...props }, ref) => {
    const iconLeft = leftIcon || prefixIcon;
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-stone-400">
              {iconLeft}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 shadow-xs transition-all placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-60",
              iconLeft && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-600 focus:ring-red-500/20 bg-red-50/30",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-stone-400">
              {rightIcon}
            </div>
          )}
        </div>
        {typeof error === "string" && (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
