import { Home, PhoneCall, Siren } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900 p-6 text-center font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200 mx-auto shadow-2xs">
          <Siren className="h-8 w-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight block">
            404
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-stone-900">
            Emergency Route Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            The page or emergency resource you are looking for has been moved,
            does not exist, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full font-bold text-xs gap-1.5 h-10"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Link href="/dashboard/emergency/new" className="w-full sm:w-auto">
            <Button
              variant="emergency"
              size="sm"
              className="w-full font-black text-xs gap-1.5 h-10 shadow-xs"
            >
              <Siren className="h-3.5 w-3.5" />
              <span>Request SOS</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
          <PhoneCall className="h-3.5 w-3.5 text-red-600" />
          <span>
            Need Urgent Assistance? Dial <strong>999</strong> Hotline
          </span>
        </div>
      </div>
    </div>
  );
}
