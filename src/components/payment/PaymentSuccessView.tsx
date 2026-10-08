"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PaymentInvoiceReceipt } from "@/components/payment/PaymentInvoiceReceipt";
import { Button } from "@/components/ui/button";
import {
  useExecuteBkashPayment,
  useTripPayment,
} from "@/lib/hooks/usePayments";
import { useTrip } from "@/lib/hooks/useTrips";
import type { Payment } from "@/types";

export function PaymentSuccessView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentID = searchParams.get("paymentID");
  const bKashStatus = searchParams.get("status");
  const tripIdParam = searchParams.get("tripId");
  const sessionId = searchParams.get("session_id");

  const [verifiedPayment, setVerifiedPayment] = useState<Payment | null>(null);
  const [executing, setExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const executionAttempted = useRef(false);

  const executeBkashMutation = useExecuteBkashPayment();

  // Load trip & payment details
  const tripId = tripIdParam || (verifiedPayment?.tripId as string);
  const { data: tripData } = useTrip(tripId);
  const { data: paymentData } = useTripPayment(tripId);

  const trip = tripData;
  const payment =
    verifiedPayment ||
    paymentData?.data ||
    (paymentData as unknown as Payment) ||
    trip?.payment;

  useEffect(() => {
    // If bKash callback redirects here with paymentID and status=success
    if (paymentID && bKashStatus === "success" && !executionAttempted.current) {
      executionAttempted.current = true;
      setExecuting(true);

      executeBkashMutation
        .mutateAsync({ paymentID })
        .then((res: any) => {
          const paymentData = res?.data?.payment || res?.payment;
          if (paymentData) {
            setVerifiedPayment(paymentData);
          }
        })
        .catch((err) => {
          console.error("Execute bKash error:", err);
          setExecutionError(
            err instanceof Error
              ? err.message
              : "Failed to execute bKash payment",
          );
        })
        .finally(() => {
          setExecuting(false);
        });
    }
  }, [paymentID, bKashStatus, executeBkashMutation]);

  const handlePrint = () => {
    window.print();
  };

  if (executing) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-[#FFF0F6] text-[#E2136E] border border-[#E2136E]/20 flex items-center justify-center mx-auto shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="text-xl font-black text-stone-900">
          Confirming bKash Payment...
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Securing transaction token and updating emergency transit status.
          Please do not close this window.
        </p>
      </div>
    );
  }

  if (executionError) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 space-y-5 text-center">
        <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-stone-900">
            Payment Verification Notice
          </h2>
          <p className="text-xs text-stone-600">{executionError}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/trips")}
            className="w-full sm:w-auto font-bold text-xs"
          >
            Go to Trips History
          </Button>
          <Button
            size="sm"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto font-bold text-xs bg-stone-900 text-white"
          >
            Retry Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* 1. Success Hero Banner */}
      <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-50/70 p-6 sm:p-8 text-center space-y-3 shadow-xs">
        <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
            Payment Confirmed • Transaction Settled
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            Emergency Service Paid Successfully!
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Thank you. Your ambulance dispatch and paramedic care charges have
            been verified and processed.
          </p>
        </div>
      </div>

      {/* 2. Official Medical Receipt */}
      <PaymentInvoiceReceipt
        trip={trip}
        payment={payment}
        transactionId={paymentID || sessionId}
      />

      {/* 3. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrint}
          className="w-full sm:w-auto h-11 text-xs font-bold gap-2"
        >
          <Printer className="h-4 w-4 text-stone-600" />
          <span>Print / Save PDF Receipt</span>
        </Button>

        <Link
          href="/dashboard/trips"
          className="inline-flex items-center justify-center w-full sm:w-auto h-11 px-5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white gap-2 transition-colors shadow-2xs"
        >
          <span>View Trip History</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
