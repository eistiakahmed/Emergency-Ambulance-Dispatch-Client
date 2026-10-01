import { api } from "./index";
import type { Hospital, ApiResponse, PaginatedResponse } from "@/types";

export interface HospitalFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  hasIcu?: boolean;
  minIcuBeds?: number;
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
    const res = await api.get<PaginatedResponse<Hospital>>("/hospitals", {
      params,
    });
    return res.data;
  },

  // Get hospital by ID
  getById: async (id: string): Promise<Hospital> => {
    const res = await api.get<ApiResponse<Hospital>>(`/hospitals/${id}`);
    return res.data.data;
  },

  // Admin/Staff update bed capacities
  updateBedCapacity: async (
    id: string,
    payload: UpdateBedCapacityPayload
  ): Promise<Hospital> => {
    const res = await api.patch<ApiResponse<Hospital>>(
      `/hospitals/${id}/beds`,
      payload
    );
    return res.data.data;
  },

  // Admin create hospital
  create: async (data: Partial<Hospital>): Promise<Hospital> => {
    const res = await api.post<ApiResponse<Hospital>>("/hospitals", data);
    return res.data.data;
  },

  // Admin update hospital details
  update: async (id: string, data: Partial<Hospital>): Promise<Hospital> => {
    const res = await api.patch<ApiResponse<Hospital>>(`/hospitals/${id}`, data);
    return res.data.data;
  },

  // Admin delete hospital
  delete: async (id: string): Promise<void> => {
    await api.delete(`/hospitals/${id}`);
  },
};
