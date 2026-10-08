import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Pulse Emergency Dispatch System",
  description: "Sign in to access your Pulse emergency dispatch portal.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Login"
      footer={
        <p>
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Create an Account
          </Link>
        </p>
      }
    >
      <Suspense
        fallback={
          <div className="min-h-[250px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
