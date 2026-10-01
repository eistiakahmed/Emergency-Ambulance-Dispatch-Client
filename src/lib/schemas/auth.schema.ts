import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerPatientSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^(?:\+?88)?01[3-9]\d{8}$/,
        "Please enter a valid Bangladesh phone number (e.g. 01712345678)"
      ),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterPatientInput = z.infer<typeof registerPatientSchema>;

export const registerDriverSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^(?:\+?88)?01[3-9]\d{8}$/,
        "Please enter a valid Bangladesh phone number (e.g. 01712345678)"
      ),
    licenseNumber: z
      .string()
      .min(4, "Valid driver license number is required"),
    vehicleType: z.enum([
      "BASIC_LIFE_SUPPORT",
      "ADVANCED_LIFE_SUPPORT",
      "PATIENT_TRANSPORT",
      "NEONATAL",
    ]),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterDriverInput = z.infer<typeof registerDriverSchema>;
