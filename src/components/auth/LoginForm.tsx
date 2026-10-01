"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import { DemoLoginBar } from "@/components/auth/DemoLoginBar";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { authApi } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFillCredentials = (email: string, pass: string) => {
    setFormData((prev) => ({
      ...prev,
      email,
      password: pass,
    }));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.login(formData);

      if (res?.user) {
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
          })
        );

        toast.success(`Welcome back, ${res.user.name}!`, {
          description: "Authenticated successfully.",
        });

        const target =
          redirectParam ||
          (res.user.role === "ADMIN"
            ? "/admin"
            : res.user.role === "DRIVER"
            ? "/provider"
            : "/dashboard");

        window.location.assign(target);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password.";
      toast.error("Authentication Failed", {
        description: message,
      });
      setErrors({ email: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Credentials Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <FormField label="Email Address" error={errors.email} required htmlFor="email">
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              error={errors.email}
              className="pl-10"
              autoComplete="email"
            />
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          </div>
        </FormField>

        {/* Password Field */}
        <FormField label="Password" error={errors.password} required htmlFor="password">
          <div className="relative">
            <PasswordInput
              id="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              error={!!errors.password}
              className="pl-10"
              autoComplete="current-password"
            />
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          </div>
        </FormField>

        {/* Options */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rememberMe: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-500"
            />
            <span>Remember this device</span>
          </label>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Password Reset", {
                description:
                  "For demo accounts, use the 1-Click Demo Login below or contact support.",
              });
            }}
            className="font-medium text-stone-500 hover:text-stone-800 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-sm sm:text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 rounded-xl transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Sign In to Account</span>
            </span>
          )}
        </Button>
      </form>

      {/* 1-Click Quick Demo Login Section */}
      <DemoLoginBar onFillCredentials={handleFillCredentials} />
    </div>
  );
}
