"use client";

import { useMutation } from "@tanstack/react-query";
import { Camera, Save } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import type { User } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(\+?88)?01\d{9}$/, "Enter a valid phone number (01XXXXXXXXX)")
    .or(z.literal("")),
});

export function ProfileView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const saveMutation = useMutation({
    mutationFn: (payload: { name: string; phone?: string }) =>
      api.patch<User>("/users/me", payload),
    onSuccess: (updated) => {
      if (user) dispatch(setUser({ ...user, ...updated }));
      toast.success("Profile updated");
    },
    onError: (err: unknown) =>
      toast.error("Update failed", {
        description: err instanceof Error ? err.message : undefined,
      }),
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("avatar", file);
      return api.patch<User>("/users/me/avatar", form);
    },
    onSuccess: (updated) => {
      if (user) dispatch(setUser({ ...user, ...updated }));
      toast.success("Avatar updated");
    },
    onError: (err: unknown) =>
      toast.error("Avatar upload failed", {
        description: err instanceof Error ? err.message : undefined,
      }),
  });

  if (!user) {
    return (
      <div className="h-64 rounded-2xl border border-stone-200 bg-white animate-pulse" />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = profileSchema.safeParse({ name, phone });
    if (!result.success) {
      const next: { name?: string; phone?: string } = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as "name" | "phone";
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    saveMutation.mutate({
      name: result.data.name,
      ...(result.data.phone ? { phone: result.data.phone } : {}),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs flex flex-col items-center text-center gap-3">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-24 w-24 rounded-full object-cover border border-stone-200"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-600 text-3xl font-black border border-red-100">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-black text-stone-900">{user.name}</p>
          <p className="text-xs text-stone-500">{user.email}</p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) avatarMutation.mutate(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={avatarMutation.isPending}
          onClick={() => fileRef.current?.click()}
          className="gap-1.5 font-bold text-xs"
        >
          <Camera className="h-3.5 w-3.5" />
          <span>Change Photo</span>
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4"
      >
        <h2 className="text-base font-black text-stone-900">
          Personal Information
        </h2>

        <FormField
          label="Full Name"
          htmlFor="name"
          error={errors.name}
          required
        >
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errors.name)}
          />
        </FormField>

        <FormField label="Phone" htmlFor="phone" error={errors.phone}>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={Boolean(errors.phone)}
            placeholder="01XXXXXXXXX"
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email"
          helperText="Email address cannot be changed."
        >
          <Input id="email" value={user.email} disabled readOnly />
        </FormField>

        <Button
          type="submit"
          variant="emergency"
          isLoading={saveMutation.isPending}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </form>
    </div>
  );
}
