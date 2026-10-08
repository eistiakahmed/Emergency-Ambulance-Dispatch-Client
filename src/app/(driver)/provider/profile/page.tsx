import type { Metadata } from "next";
import { ProfileView } from "@/components/patient/ProfileView";

export const metadata: Metadata = {
  title: "Driver Profile | PulseRescue",
  description: "Manage your driver account details and profile photo.",
};

export default function DriverProfilePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Driver Profile Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage your driver responder profile details and credentials.
        </p>
      </div>
      <ProfileView />
    </div>
  );
}
