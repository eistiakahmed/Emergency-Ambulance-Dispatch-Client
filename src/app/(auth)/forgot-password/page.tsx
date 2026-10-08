import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Reset Password | PulseRescue Emergency Dispatch",
  description:
    "Reset your password securely via email verification code on PulseRescue.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      subtitle="Verify your identity with a secure one-time code to regain account access."
      footer={
        <p>
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Back to Sign In
          </Link>
        </p>
      }
    >
      <Suspense
        fallback={
          <div className="min-h-[260px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
