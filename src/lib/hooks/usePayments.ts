import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type BkashExecutePayload,
  type BkashInitiatePayload,
  paymentsApi,
  type StripeInitiatePayload,
} from "@/lib/api/payments";
import { TRIP_KEYS } from "./useTrips";

export const PAYMENT_KEYS = {
  all: ["payments"] as const,
  byTrip: (tripId: string) => [...PAYMENT_KEYS.all, "trip", tripId] as const,
  detail: (id: string) => [...PAYMENT_KEYS.all, "detail", id] as const,
};

// Query payment by Trip ID
export function useTripPayment(tripId: string) {
  return useQuery({
    queryKey: PAYMENT_KEYS.byTrip(tripId),
    queryFn: () => paymentsApi.getByTripId(tripId),
    enabled: Boolean(tripId),
  });
}

// Query payment by Payment ID
export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: PAYMENT_KEYS.detail(paymentId),
    queryFn: () => paymentsApi.getById(paymentId),
    enabled: Boolean(paymentId),
  });
}

// Mutation: Initiate bKash Payment
export function useInitiateBkashPayment() {
  return useMutation({
    mutationFn: (payload: BkashInitiatePayload) =>
      paymentsApi.initiateBkash(payload),
    onSuccess: (res) => {
      const data: any = (res as any)?.data || res;
      const url = data?.bkashURL;
      if (url) {
        toast.info("Redirecting to bKash Gateway...", {
          description: `Total amount: ৳${data.amount || ""}`,
        });
        window.location.assign(url);
      } else {
        toast.error("bKash Gateway URL not received");
      }
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initiate bKash payment gateway";
      toast.error("bKash Payment Error", { description: message });
    },
  });
}

// Mutation: Execute / Confirm bKash Payment
export function useExecuteBkashPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BkashExecutePayload) =>
      paymentsApi.executeBkash(payload),
    onSuccess: (_res) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
      toast.success("bKash Payment Successful!", {
        description: "Your emergency transit fare has been settled.",
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Could not verify bKash payment transaction";
      toast.error("Payment Confirmation Failed", { description: message });
    },
  });
}

// Mutation: Initiate Stripe Payment
export function useInitiateStripePayment() {
  return useMutation({
    mutationFn: (payload: StripeInitiatePayload) =>
      paymentsApi.initiateStripe(payload),
    onSuccess: (res) => {
      const data: any = (res as any)?.data || res;
      const url = data?.checkoutUrl;
      if (url) {
        toast.info("Redirecting to Stripe Checkout...", {
          description: `Amount: $${data.amount || ""}`,
        });
        window.location.assign(url);
      }
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create Stripe payment session";
      toast.error("Stripe Checkout Error", { description: message });
    },
  });
}
