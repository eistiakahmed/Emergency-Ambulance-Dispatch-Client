import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  hospitalsApi,
  type HospitalFilterParams,
  type UpdateBedCapacityPayload,
} from "@/lib/api/hospitals";
import { toast } from "sonner";

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
        updatedHospital
      );
      queryClient.invalidateQueries({ queryKey: HOSPITAL_KEYS.lists() });
      toast.success("Bed capacity updated successfully", {
        description: `${updatedHospital.name}: ${updatedHospital.availableIcuBeds} ICU / ${updatedHospital.availableGeneralBeds} Gen available`,
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update bed capacity";
      toast.error("Bed Update Failed", { description: message });
    },
  });
}
