import { api } from "../api";
import type { EmergencyRequest, PaginatedResponse } from "@/types";

export interface EmergencyFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  emergencyType?: string;
  patientId?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export interface CreateEmergencyPayload {
  patientName: string;
  patientPhone: string;
  emergencyType: "CARDIAC" | "TRAUMA" | "RESPIRATORY" | "PREGNANCY" | "GENERAL" | "OTHER";
  severityLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationHospitalId?: string;
  notes?: string;
}

export const emergenciesApi = {
  // Create SOS emergency request
  create: async (payload: CreateEmergencyPayload): Promise<EmergencyRequest> => {
    return api.post<EmergencyRequest>("/emergencies", payload);
  },

  // List emergencies with pagination & filters
  list: async (
    params?: EmergencyFilterParams
  ): Promise<PaginatedResponse<EmergencyRequest>> => {
    return api.get<PaginatedResponse<EmergencyRequest>>("/emergencies", {
      params,
    });
  },

  // Get emergency by ID
  getById: async (id: string): Promise<EmergencyRequest> => {
    return api.get<EmergencyRequest>(`/emergencies/${id}`);
  },

  // Cancel emergency request
  cancel: async (id: string, reason: string): Promise<EmergencyRequest> => {
    return api.post<EmergencyRequest>(`/emergencies/${id}/cancel`, { reason });
  },
};
