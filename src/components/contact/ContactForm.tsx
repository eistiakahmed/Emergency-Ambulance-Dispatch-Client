"use client";

import { Send } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";

const DISPATCH_EMAIL = "dispatch@emergency.com";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;
type Errors = Partial<Record<keyof ContactValues, string>>;

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof ContactValues) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    // No inquiry endpoint exists on the API, so hand the message to the user's mail client.
    const body = `${result.data.message}\n\n— ${result.data.name} (${result.data.email})`;
    window.location.href = `mailto:${DISPATCH_EMAIL}?subject=${encodeURIComponent(
      result.data.subject,
    )}&body=${encodeURIComponent(body)}`;
    toast.info("Opening your email app to send the message");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          htmlFor="name"
          error={errors.name}
          required
        >
          <Input
            id="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            error={Boolean(errors.name)}
            placeholder="Your name"
          />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email} required>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            error={Boolean(errors.email)}
            placeholder="you@example.com"
          />
        </FormField>
      </div>

      <FormField
        label="Subject"
        htmlFor="subject"
        error={errors.subject}
        required
      >
        <Input
          id="subject"
          value={values.subject}
          onChange={(e) => set("subject")(e.target.value)}
          error={Boolean(errors.subject)}
          placeholder="How can we help?"
        />
      </FormField>

      <FormField
        label="Message"
        htmlFor="message"
        error={errors.message}
        required
      >
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder="Describe your inquiry"
          className="flex w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-xs outline-none placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 aria-invalid:border-red-500"
          aria-invalid={Boolean(errors.message)}
        />
      </FormField>

      <Button type="submit" variant="emergency" className="gap-2">
        <Send className="h-4 w-4" />
        <span>Send Inquiry</span>
      </Button>
    </form>
  );
}
