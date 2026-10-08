import type { Metadata } from "next";
import { ProfileView } from "@/components/patient/ProfileView";

export const metadata: Metadata = {
  title: "Admin Profile | PulseRescue",
  description: "Manage your administrator account details and profile photo.",
};

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
          Admin Profile Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage your administrator profile details and credentials.
        </p>
      </div>
      <ProfileView />
    </div>
  );
}
