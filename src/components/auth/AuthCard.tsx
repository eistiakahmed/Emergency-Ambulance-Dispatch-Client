import type React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  footer,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main Container matching Home Page Warm Card styling */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm shadow-stone-200/50",
          className,
        )}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form / Content */}
          <div>{children}</div>

          {/* Footer Slot */}
          {footer && (
            <div className="pt-4 border-t border-stone-100 text-center text-xs sm:text-sm text-stone-600 font-medium">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
