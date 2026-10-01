import { api } from "../api";
import type { Hospital, PaginatedResponse } from "@/types";

export interface HospitalFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  hasIcu?: boolean;
  minIcuBeds?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export interface UpdateBedCapacityPayload {
  availableIcuBeds?: number;
  availableGeneralBeds?: number;
  totalIcuBeds?: number;
  totalGeneralBeds?: number;
}

export const hospitalsApi = {
  // List hospitals with search and bed capacity filters
  list: async (params?: HospitalFilterParams): Promise<PaginatedResponse<Hospital>> => {
    return api.get<PaginatedResponse<Hospital>>("/hospitals", {
      params,
    });
  },

  // Get hospital by ID
  getById: async (id: string): Promise<Hospital> => {
    return api.get<Hospital>(`/hospitals/${id}`);
  },

  // Admin/Staff update bed capacities
  updateBedCapacity: async (
    id: string,
    payload: UpdateBedCapacityPayload
  ): Promise<Hospital> => {
    return api.patch<Hospital>(`/hospitals/${id}/beds`, payload);
  },

  // Admin create hospital
  create: async (data: Partial<Hospital>): Promise<Hospital> => {
    return api.post<Hospital>("/hospitals", data);
  },

  // Admin update hospital details
  update: async (id: string, data: Partial<Hospital>): Promise<Hospital> => {
    return api.patch<Hospital>(`/hospitals/${id}`, data);
  },

  // Admin delete hospital
  delete: async (id: string): Promise<void> => {
    await api.delete(`/hospitals/${id}`);
  },
};
