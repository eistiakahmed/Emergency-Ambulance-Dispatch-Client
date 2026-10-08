import type { AuditLog, PaginatedResponse, User } from "@/types";
import { api } from "../api";

export interface AdminStats {
  totalUsers: number;
  totalDrivers: number;
  activeEmergencies: number;
  activeTrips: number;
  completedTrips: number;
  operationalAmbulances: number;
  totalAmbulances: number;
  availableBeds: {
    _sum: {
      emergencyBedsAvailable: number | null;
      icuBedsAvailable: number | null;
    };
  };
  paymentAggregate: {
    _sum: {
      amount: number | null;
    };
    _count: {
      id: number;
    };
  };
}

export interface UserFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  [key: string]: string | number | boolean | undefined | null;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    return api.get<AdminStats>("/admin/dashboard-stats");
  },

  listUsers: async (
    params?: UserFilterParams,
  ): Promise<PaginatedResponse<User>> => {
    return api.get<PaginatedResponse<User>>("/admin/users", { params });
  },

  updateUserRole: async (
    userId: string,
    role: "ADMIN" | "DRIVER" | "PATIENT",
  ): Promise<User> => {
    return api.patch<User>(`/admin/users/${userId}/role`, { role });
  },

  updateUserStatus: async (
    userId: string,
    isActive: boolean,
  ): Promise<User> => {
    return api.patch<User>(`/admin/users/${userId}/status`, { isActive });
  },

  listAuditLogs: async (
    params?: Record<string, any>,
  ): Promise<PaginatedResponse<AuditLog>> => {
    return api.get<PaginatedResponse<AuditLog>>("/admin/audit-logs", {
      params,
    });
  },
};
