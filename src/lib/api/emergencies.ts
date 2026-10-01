import { api } from "./index";
import type { EmergencyRequest, ApiResponse, PaginatedResponse } from "@/types";

export interface EmergencyFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  emergencyType?: string;
  patientId?: string;
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
    const res = await api.post<ApiResponse<EmergencyRequest>>("/emergencies", payload);
    return res.data.data;
  },

  // List emergencies with pagination & filters
  list: async (
    params?: EmergencyFilterParams
  ): Promise<PaginatedResponse<EmergencyRequest>> => {
    const res = await api.get<PaginatedResponse<EmergencyRequest>>("/emergencies", {
      params,
    });
    return res.data;
  },

  // Get emergency by ID
  getById: async (id: string): Promise<EmergencyRequest> => {
    const res = await api.get<ApiResponse<EmergencyRequest>>(`/emergencies/${id}`);
    return res.data.data;
  },

  // Cancel emergency request
  cancel: async (id: string, reason: string): Promise<EmergencyRequest> => {
    const res = await api.post<ApiResponse<EmergencyRequest>>(
      `/emergencies/${id}/cancel`,
      { reason }
    );
    return res.data.data;
  },
};
