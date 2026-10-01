import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PulseRescue | Enterprise Emergency Ambulance Dispatch System",
  description:
    "Rapid emergency medical dispatch, live ambulance fleet tracking, hospital emergency bed discovery, and automated triage routing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-full flex flex-col bg-stone-50 text-stone-900 selection:bg-red-500 selection:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
