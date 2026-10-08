import type { PaginatedResponse, Trip, TripStatus } from "@/types";
import { api } from "../api";

export interface TripFilterParams {
  page?: number;
  limit?: number;
  status?: TripStatus | string;
  driverId?: string;
  patientId?: string;
  [key: string]: string | number | boolean | undefined | null;
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
    return api.get<Trip | null>("/trips/active");
  },

  // List all trips (Admin or History)
  list: async (params?: TripFilterParams): Promise<PaginatedResponse<Trip>> => {
    return api.get<PaginatedResponse<Trip>>("/trips", { params });
  },

  // Get single trip by ID
  getById: async (id: string): Promise<Trip> => {
    return api.get<Trip>(`/trips/${id}`);
  },

  // Admin dispatch: Create / Dispatch trip
  create: async (payload: CreateTripPayload): Promise<Trip> => {
    return api.post<Trip>("/trips/dispatch", payload);
  },
  dispatch: async (payload: CreateTripPayload): Promise<Trip> => {
    return api.post<Trip>("/trips/dispatch", payload);
  },

  // Driver update trip milestone status
  updateStatus: async (
    id: string,
    payload: UpdateTripStatusPayload,
  ): Promise<Trip> => {
    return api.patch<Trip>(`/trips/${id}/status`, payload);
  },
};
