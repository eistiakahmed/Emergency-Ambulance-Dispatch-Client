import type { Metadata } from "next";
import { ProfileView } from "@/components/patient/ProfileView";

export const metadata: Metadata = {
  title: "My Profile | PulseRescue",
  description: "Manage your personal information and profile photo.",
};

export default function PatientProfilePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Profile Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Keep your contact details up to date so dispatchers can reach you.
        </p>
      </div>
      <ProfileView />
    </div>
  );
}
