import React from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register | Pulse Emergency Dispatch System",
  description: "Create an account or onboard as an EMS ambulance driver.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an Account"
      subtitle="Register as an emergency patient or apply to join the operational EMS driver fleet."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Sign In Here
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
