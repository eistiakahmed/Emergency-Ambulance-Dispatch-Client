import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi, type UserFilterParams } from "@/lib/api/admin";

export const ADMIN_KEYS = {
  all: ["admin"] as const,
  stats: () => [...ADMIN_KEYS.all, "stats"] as const,
  users: (params?: UserFilterParams) =>
    [...ADMIN_KEYS.all, "users", params] as const,
  auditLogs: (params?: Record<string, any>) =>
    [...ADMIN_KEYS.all, "audit-logs", params] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_KEYS.stats(),
    queryFn: () => adminApi.getStats(),
    refetchInterval: 10000,
  });
}

export function useAdminUsers(params?: UserFilterParams) {
  return useQuery({
    queryKey: ADMIN_KEYS.users(params),
    queryFn: () => adminApi.listUsers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useAuditLogs(params?: Record<string, any>) {
  return useQuery({
    queryKey: ADMIN_KEYS.auditLogs(params),
    queryFn: () => adminApi.listAuditLogs(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "ADMIN" | "DRIVER" | "PATIENT";
    }) => adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all });
      toast.success("User role updated successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update role";
      toast.error("Role Update Failed", { description: message });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminApi.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all });
      toast.success("User account status updated");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error("Status Update Failed", { description: message });
    },
  });
}
