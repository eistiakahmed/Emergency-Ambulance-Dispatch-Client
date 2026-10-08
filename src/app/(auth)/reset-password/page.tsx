import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Set New Password | PulseRescue Emergency Dispatch",
  description: "Set a new secure password for your PulseRescue account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set New Password"
      subtitle="Enter your verification code and choose a new secure password."
      footer={
        <p>
          Need to sign in instead?{" "}
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
