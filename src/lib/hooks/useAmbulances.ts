import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ambulancesApi,
  type AmbulanceFilterParams,
  type NearbyAmbulanceParams,
  type UpdateDriverStatusPayload,
} from "@/lib/api/ambulances";
import { toast } from "sonner";

export const AMBULANCE_KEYS = {
  all: ["ambulances"] as const,
  lists: () => [...AMBULANCE_KEYS.all, "list"] as const,
  list: (params?: AmbulanceFilterParams) =>
    [...AMBULANCE_KEYS.lists(), params] as const,
  nearby: (params: NearbyAmbulanceParams) =>
    [...AMBULANCE_KEYS.all, "nearby", params] as const,
  details: () => [...AMBULANCE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...AMBULANCE_KEYS.details(), id] as const,
  myVehicle: () => [...AMBULANCE_KEYS.all, "my-vehicle"] as const,
};

// Hook for fetching paginated ambulances
export function useAmbulances(params?: AmbulanceFilterParams) {
  return useQuery({
    queryKey: AMBULANCE_KEYS.list(params),
    queryFn: () => ambulancesApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}

// Hook for nearby ambulances
export function useNearbyAmbulances(
  params: NearbyAmbulanceParams,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: AMBULANCE_KEYS.nearby(params),
    queryFn: () => ambulancesApi.getNearby(params),
    enabled: enabled && Boolean(params.latitude && params.longitude),
    refetchInterval: 10000, // Real-time 10s polling for nearby ambulances
  });
}

// Hook for single ambulance
export function useAmbulance(id: string) {
  return useQuery({
    queryKey: AMBULANCE_KEYS.detail(id),
    queryFn: () => ambulancesApi.getById(id),
    enabled: Boolean(id),
  });
}

// Hook for Driver's assigned vehicle
export function useMyVehicle() {
  return useQuery({
    queryKey: AMBULANCE_KEYS.myVehicle(),
    queryFn: () => ambulancesApi.getMyVehicle(),
  });
}

// Mutation to update driver availability status
export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDriverStatusPayload) =>
      ambulancesApi.updateDriverStatus(payload),
    onSuccess: (updatedVehicle) => {
      queryClient.setQueryData(AMBULANCE_KEYS.myVehicle(), updatedVehicle);
      queryClient.invalidateQueries({ queryKey: AMBULANCE_KEYS.lists() });
      toast.success("Driver status updated successfully", {
        description: `Status changed to ${updatedVehicle.status}`,
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update driver status";
      toast.error("Status Update Failed", { description: message });
    },
  });
}
