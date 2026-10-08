import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type HospitalFilterParams,
  hospitalsApi,
  type UpdateBedCapacityPayload,
} from "@/lib/api/hospitals";

export const HOSPITAL_KEYS = {
  all: ["hospitals"] as const,
  lists: () => [...HOSPITAL_KEYS.all, "list"] as const,
  list: (params?: HospitalFilterParams) =>
    [...HOSPITAL_KEYS.lists(), params] as const,
  details: () => [...HOSPITAL_KEYS.all, "detail"] as const,
  detail: (id: string) => [...HOSPITAL_KEYS.details(), id] as const,
};

// Hook for fetching paginated hospitals & bed statuses
export function useHospitals(params?: HospitalFilterParams) {
  return useQuery({
    queryKey: HOSPITAL_KEYS.list(params),
    queryFn: () => hospitalsApi.list(params),
    placeholderData: (previousData) => previousData,
    refetchInterval: 15000, // 15s bed availability refresh
  });
}

// Hook for single hospital details
export function useHospital(id: string) {
  return useQuery({
    queryKey: HOSPITAL_KEYS.detail(id),
    queryFn: () => hospitalsApi.getById(id),
    enabled: Boolean(id),
  });
}

// Mutation to update live bed availability (Admin/Staff)
export function useUpdateBedCapacity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBedCapacityPayload;
    }) => hospitalsApi.updateBedCapacity(id, payload),
    onSuccess: (updatedHospital) => {
      queryClient.setQueryData(
        HOSPITAL_KEYS.detail(updatedHospital.id),
        updatedHospital,
      );
      queryClient.invalidateQueries({ queryKey: HOSPITAL_KEYS.lists() });
      toast.success("Bed capacity updated successfully", {
        description: `${updatedHospital.name}: ${updatedHospital.icuBedsAvailable ?? updatedHospital.availableIcuBeds ?? 0} ICU / ${updatedHospital.emergencyBedsAvailable ?? updatedHospital.erBedsAvailable ?? updatedHospital.availableGeneralBeds ?? 0} ER available`,
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update bed capacity";
      toast.error("Bed Update Failed", { description: message });
    },
  });
}

// Mutation to register / create a new hospital (Admin)
export function useCreateHospital() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof hospitalsApi.create>[0]) =>
      hospitalsApi.create(payload),
    onSuccess: (newHospital) => {
      queryClient.invalidateQueries({ queryKey: HOSPITAL_KEYS.lists() });
      toast.success("Hospital Registered Successfully", {
        description: `${newHospital.name} added to the emergency intake network.`,
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to register hospital";
      toast.error("Hospital Creation Failed", { description: message });
    },
  });
}

// Mutation to update hospital info (Admin)
export function useUpdateHospital() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof hospitalsApi.update>[1];
    }) => hospitalsApi.update(id, payload),
    onSuccess: (updatedHospital) => {
      queryClient.setQueryData(
        HOSPITAL_KEYS.detail(updatedHospital.id),
        updatedHospital,
      );
      queryClient.invalidateQueries({ queryKey: HOSPITAL_KEYS.lists() });
      toast.success("Hospital Updated", {
        description: `${updatedHospital.name} details have been updated.`,
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update hospital";
      toast.error("Update Failed", { description: message });
    },
  });
}

// Mutation to delete / remove hospital (Admin)
export function useDeleteHospital() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hospitalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOSPITAL_KEYS.lists() });
      toast.success("Hospital Removed", {
        description: "Hospital has been decommissioned from dispatch routing.",
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to delete hospital";
      toast.error("Deletion Failed", { description: message });
    },
  });
}
