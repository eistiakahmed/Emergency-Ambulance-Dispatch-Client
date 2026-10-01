"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 pr-11 text-sm text-stone-900 shadow-xs transition-all placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-60",
          error && "border-red-500 focus:border-red-600 focus:ring-red-500/20 bg-red-50/30",
          className
        )}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4 text-stone-600" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
