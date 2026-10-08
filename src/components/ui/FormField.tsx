import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      required,
      htmlFor,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("space-y-1.5 w-full", className)} {...props}>
        {label && (
          <label
            htmlFor={htmlFor}
            className="flex items-center text-xs font-semibold uppercase tracking-wider text-stone-700"
          >
            <span>{label}</span>
            {required && <span className="ml-1 text-red-500 font-bold">*</span>}
          </label>
        )}

        <div>{children}</div>

        {error ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1 animate-in fade-in-50 duration-200">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-stone-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";
