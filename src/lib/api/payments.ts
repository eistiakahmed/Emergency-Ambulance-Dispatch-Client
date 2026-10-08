import type { ApiResponse, Payment } from "@/types";
import { api } from "../api";

export interface BkashInitiatePayload {
  tripId: string;
  payerReference?: string;
  callbackURL?: string;
  agreementID?: string;
}

export interface BkashInitiateResponse {
  paymentId: string;
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  amount: number;
  currency: string;
  status: string;
}

export interface BkashExecutePayload {
  paymentID: string;
}

export interface BkashExecuteResponse {
  payment: Payment;
  bkashResponse?: {
    statusCode: string;
    statusMessage: string;
    paymentID: string;
    trxID: string;
    amount: string;
    transactionStatus: string;
    merchantInvoiceNumber: string;
  };
}

export interface StripeInitiatePayload {
  tripId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeInitiateResponse {
  paymentId: string;
  checkoutUrl: string;
  sessionId: string;
  amount: number;
  currency: string;
}

export const paymentsApi = {
  // bKash Merchant Endpoints
  initiateBkash: async (
    payload: BkashInitiatePayload,
  ): Promise<ApiResponse<BkashInitiateResponse>> => {
    return api.post<ApiResponse<BkashInitiateResponse>>(
      "/payments/bkash/initiate",
      payload,
    );
  },

  executeBkash: async (
    payload: BkashExecutePayload,
  ): Promise<ApiResponse<BkashExecuteResponse>> => {
    return api.post<ApiResponse<BkashExecuteResponse>>(
      "/payments/bkash/execute",
      payload,
    );
  },

  queryBkashStatus: async (paymentId: string): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>(`/payments/bkash/status/${paymentId}`);
  },

  // Stripe Fallback Endpoints
  initiateStripe: async (
    payload: StripeInitiatePayload,
  ): Promise<ApiResponse<StripeInitiateResponse>> => {
    return api.post<ApiResponse<StripeInitiateResponse>>(
      "/payments/initiate",
      payload,
    );
  },

  // Payment Queries
  getByTripId: async (tripId: string): Promise<ApiResponse<Payment>> => {
    return api.get<ApiResponse<Payment>>(`/payments/trip/${tripId}`);
  },

  getById: async (paymentId: string): Promise<ApiResponse<Payment>> => {
    return api.get<ApiResponse<Payment>>(`/payments/${paymentId}`);
  },
};
