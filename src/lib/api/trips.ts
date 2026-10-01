import { api } from "./index";
import type { Trip, ApiResponse, PaginatedResponse, TripStatus } from "@/types";

export interface TripFilterParams {
  page?: number;
  limit?: number;
  status?: TripStatus | string;
  driverId?: string;
  patientId?: string;
}

export interface UpdateTripStatusPayload {
  status: TripStatus;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface CreateTripPayload {
  emergencyRequestId: string;
  ambulanceId: string;
}

export const tripsApi = {
  // Get active trip for current logged in user (Driver or Patient)
  getActive: async (): Promise<Trip | null> => {
    const res = await api.get<ApiResponse<Trip | null>>("/trips/active");
    return res.data.data;
  },

  // List all trips (Admin or History)
  list: async (params?: TripFilterParams): Promise<PaginatedResponse<Trip>> => {
    const res = await api.get<PaginatedResponse<Trip>>("/trips", { params });
    return res.data;
  },

  // Get single trip by ID
  getById: async (id: string): Promise<Trip> => {
    const res = await api.get<ApiResponse<Trip>>(`/trips/${id}`);
    return res.data.data;
  },

  // Admin dispatch: Create trip
  create: async (payload: CreateTripPayload): Promise<Trip> => {
    const res = await api.post<ApiResponse<Trip>>("/trips", payload);
    return res.data.data;
  },

  // Driver update trip milestone status
  updateStatus: async (
    id: string,
    payload: UpdateTripStatusPayload
  ): Promise<Trip> => {
    const res = await api.patch<ApiResponse<Trip>>(`/trips/${id}/status`, payload);
    return res.data.data;
  },
};
