import { api } from "./index";
import type { Ambulance, ApiResponse, PaginatedResponse } from "@/types";

export interface AmbulanceFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export interface NearbyAmbulanceParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: string;
}

export interface UpdateDriverStatusPayload {
  status: "AVAILABLE" | "BUSY" | "ON_TRIP" | "MAINTENANCE" | "OFFLINE";
  latitude?: number;
  longitude?: number;
}

export const ambulancesApi = {
  // Get all ambulances with pagination and filters
  list: async (params?: AmbulanceFilterParams): Promise<PaginatedResponse<Ambulance>> => {
    const res = await api.get<PaginatedResponse<Ambulance>>("/ambulances", {
      params,
    });
    return res.data;
  },

  // Get nearby ambulances based on coordinates
  getNearby: async (params: NearbyAmbulanceParams): Promise<Ambulance[]> => {
    const res = await api.get<ApiResponse<Ambulance[]>>("/ambulances/nearby", {
      params,
    });
    return res.data.data;
  },

  // Get single ambulance by ID
  getById: async (id: string): Promise<Ambulance> => {
    const res = await api.get<ApiResponse<Ambulance>>(`/ambulances/${id}`);
    return res.data.data;
  },

  // Get driver's own vehicle
  getMyVehicle: async (): Promise<Ambulance | null> => {
    const res = await api.get<ApiResponse<Ambulance>>("/ambulances/driver/me");
    return res.data.data;
  },

  // Driver update availability status & location
  updateDriverStatus: async (payload: UpdateDriverStatusPayload): Promise<Ambulance> => {
    const res = await api.patch<ApiResponse<Ambulance>>(
      "/ambulances/driver/status",
      payload
    );
    return res.data.data;
  },

  // Admin create ambulance
  create: async (data: Partial<Ambulance>): Promise<Ambulance> => {
    const res = await api.post<ApiResponse<Ambulance>>("/ambulances", data);
    return res.data.data;
  },

  // Admin update ambulance
  update: async (id: string, data: Partial<Ambulance>): Promise<Ambulance> => {
    const res = await api.patch<ApiResponse<Ambulance>>(`/ambulances/${id}`, data);
    return res.data.data;
  },

  // Admin delete ambulance
  delete: async (id: string): Promise<void> => {
    await api.delete(`/ambulances/${id}`);
  },
};
