import { api } from "../api";
import type { Ambulance, PaginatedResponse } from "@/types";

export interface AmbulanceFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export interface NearbyAmbulanceParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export interface UpdateDriverStatusPayload {
  status: "AVAILABLE" | "BUSY" | "ON_TRIP" | "MAINTENANCE" | "OFFLINE";
  latitude?: number;
  longitude?: number;
}

export const ambulancesApi = {
  // Get all ambulances with pagination and filters
  list: async (params?: AmbulanceFilterParams): Promise<PaginatedResponse<Ambulance>> => {
    return api.get<PaginatedResponse<Ambulance>>("/ambulances", {
      params,
    });
  },

  // Get nearby ambulances based on coordinates
  getNearby: async (params: NearbyAmbulanceParams): Promise<Ambulance[]> => {
    return api.get<Ambulance[]>("/ambulances/nearby", {
      params,
    });
  },

  // Get single ambulance by ID
  getById: async (id: string): Promise<Ambulance> => {
    return api.get<Ambulance>(`/ambulances/${id}`);
  },

  // Get driver's own vehicle
  getMyVehicle: async (): Promise<Ambulance | null> => {
    return api.get<Ambulance | null>("/ambulances/driver/me");
  },

  // Driver update availability status & location
  updateDriverStatus: async (payload: UpdateDriverStatusPayload): Promise<Ambulance> => {
    return api.patch<Ambulance>("/ambulances/driver/status", payload);
  },

  // Admin create ambulance
  create: async (data: Partial<Ambulance>): Promise<Ambulance> => {
    return api.post<Ambulance>("/ambulances", data);
  },

  // Admin update ambulance
  update: async (id: string, data: Partial<Ambulance>): Promise<Ambulance> => {
    return api.patch<Ambulance>(`/ambulances/${id}`, data);
  },

  // Admin delete ambulance
  delete: async (id: string): Promise<void> => {
    await api.delete(`/ambulances/${id}`);
  },
};
