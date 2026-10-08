import type { EmergencyRequest, PaginatedResponse } from "@/types";
import { api } from "../api";

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
  priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  severityLevel?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  emergencyType?:
    | "CARDIAC"
    | "TRAUMA"
    | "RESPIRATORY"
    | "PREGNANCY"
    | "GENERAL"
    | "OTHER";
  symptoms?: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationHospitalId?: string;
  notes?: string;
}

export const emergenciesApi = {
  // Create SOS emergency request
  create: async (
    payload: CreateEmergencyPayload,
  ): Promise<EmergencyRequest> => {
    const formattedPriority =
      payload.priority || payload.severityLevel || "MEDIUM";
    const formattedSymptoms =
      payload.symptoms ||
      (payload.emergencyType
        ? `${payload.emergencyType} Emergency: ${payload.notes || "Immediate medical dispatch requested"}`
        : payload.notes || "Urgent emergency medical request");

    const body = {
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      priority: formattedPriority,
      pickupAddress: payload.pickupAddress,
      pickupLatitude: payload.pickupLatitude,
      pickupLongitude: payload.pickupLongitude,
      symptoms: formattedSymptoms,
      ...(payload.notes ? { notes: payload.notes } : {}),
      ...(payload.destinationHospitalId
        ? { destinationHospitalId: payload.destinationHospitalId }
        : {}),
    };

    return api.post<EmergencyRequest>("/emergencies", body);
  },

  // List emergencies with pagination & filters
  list: async (
    params?: EmergencyFilterParams,
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
