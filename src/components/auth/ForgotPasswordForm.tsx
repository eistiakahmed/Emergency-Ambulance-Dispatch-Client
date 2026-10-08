"use client";

import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { authApi } from "@/lib/api/auth";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/schemas/auth.schema";

export function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  // Step 1: Email entry, Step 2: OTP + New Password
  const [step, setStep] = useState<1 | 2>(initialEmail ? 2 : 1);

  // Form State
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // OTP Countdown Timer (seconds)
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setErrors({
        email: validation.error.issues[0]?.message || "Invalid email",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.forgotPassword(email);
      toast.success("Verification Code Sent!", {
        description: `We've sent a 6-digit OTP code to ${email}.`,
      });
      setStep(2);
      setCountdown(60);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset code.";
      toast.error("Request Failed", { description: message });
      setErrors({ email: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    try {
      setIsResending(true);
      await authApi.forgotPassword(email);
      toast.success("Code Resent!", {
        description: `A fresh 6-digit code was sent to ${email}.`,
      });
      setCountdown(60);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend code.";
      toast.error("Resend Failed", { description: message });
    } finally {
      setIsResending(false);
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = resetPasswordSchema.safeParse({
      email,
      otp,
      newPassword,
      confirmNewPassword,
    });

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
      await authApi.resetPassword({
        email,
        otp,
        newPassword,
      });

      toast.success("Password Reset Successfully!", {
        description: "Your new password is now active. Please sign in.",
      });

      router.push("/login?reset=success");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid or expired verification code.";
      toast.error("Reset Failed", { description: message });
      setErrors({ otp: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step === 1 ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
            }`}
          >
            {step === 2 ? <CheckCircle2 className="h-4 w-4" /> : "1"}
          </div>
          <span className="text-xs font-semibold text-stone-700">
            {step === 1 ? "Enter Email" : "Verified Email"}
          </span>
        </div>

        <div className="h-0.5 w-12 bg-stone-200" />

        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              step === 2
                ? "bg-red-600 text-white"
                : "bg-stone-200 text-stone-500"
            }`}
          >
            2
          </div>
          <span className="text-xs font-semibold text-stone-700">
            Set Password
          </span>
        </div>
      </div>

      {/* STEP 1: Enter Email Form */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-600" />
              <span>Find Your Account</span>
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enter the email associated with your PulseRescue emergency
              dispatch account.
            </p>
          </div>

          <FormField
            label="Email Address"
            error={errors.email}
            required
            htmlFor="forgotEmail"
          >
            <div className="relative">
              <Input
                id="forgotEmail"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
                error={errors.email}
                className="pl-10 h-11"
                autoComplete="email"
                autoFocus
              />
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-sm sm:text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 rounded-xl transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Code...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span>Send Verification Code</span>
              </span>
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: OTP & New Password Form */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-red-600" />
                <span>Enter Code &amp; New Password</span>
              </h2>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline"
              >
                Change Email
              </button>
            </div>
            <p className="text-xs text-stone-500">
              We sent a 6-digit code to{" "}
              <strong className="text-stone-800 font-mono">{email}</strong>.
            </p>
          </div>

          {/* 6-Digit Code Input */}
          <FormField
            label="6-Digit Verification Code"
            error={errors.otp}
            required
            htmlFor="otpCode"
          >
            <div className="relative">
              <Input
                id="otpCode"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtp(val);
                  if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                }}
                error={errors.otp}
                className="h-12 text-center text-lg tracking-[0.35em] font-mono font-black pl-4"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
          </FormField>

          {/* Resend Code Link */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-0.5">
            <span>Didn&apos;t receive the code?</span>
            {countdown > 0 ? (
              <span className="font-mono font-medium text-stone-400">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                disabled={isResending}
                onClick={handleResendOtp}
                className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                <RotateCcw
                  className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`}
                />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          {/* New Password Field */}
          <FormField
            label="New Password"
            error={errors.newPassword}
            required
            htmlFor="newPassword"
          >
            <div className="relative">
              <PasswordInput
                id="newPassword"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword)
                    setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                error={!!errors.newPassword}
                className="pl-10 h-11"
                autoComplete="new-password"
              />
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          {/* Confirm New Password Field */}
          <FormField
            label="Confirm New Password"
            error={errors.confirmNewPassword}
            required
            htmlFor="confirmNewPassword"
          >
            <div className="relative">
              <PasswordInput
                id="confirmNewPassword"
                placeholder="••••••••••••"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  if (errors.confirmNewPassword)
                    setErrors((prev) => ({ ...prev, confirmNewPassword: "" }));
                }}
                error={!!errors.confirmNewPassword}
                className="pl-10 h-11"
                autoComplete="new-password"
              />
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            </div>
          </FormField>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-sm sm:text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 rounded-xl transition-all mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating Password...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Save New Password &amp; Sign In</span>
              </span>
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
