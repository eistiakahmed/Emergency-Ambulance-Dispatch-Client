import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  type CreateEmergencyPayload,
  type EmergencyFilterParams,
  emergenciesApi,
} from "@/lib/api/emergencies";

export const EMERGENCY_KEYS = {
  all: ["emergencies"] as const,
  lists: () => [...EMERGENCY_KEYS.all, "list"] as const,
  list: (params?: EmergencyFilterParams) =>
    [...EMERGENCY_KEYS.lists(), params] as const,
  details: () => [...EMERGENCY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...EMERGENCY_KEYS.details(), id] as const,
};

// Hook for listing emergencies
export function useEmergencies(params?: EmergencyFilterParams) {
  return useQuery({
    queryKey: EMERGENCY_KEYS.list(params),
    queryFn: () => emergenciesApi.list(params),
    placeholderData: (previousData) => previousData,
    refetchInterval: 8000, // 8s polling for live emergency updates
  });
}

// Hook for single emergency detail
export function useEmergency(id: string) {
  return useQuery({
    queryKey: EMERGENCY_KEYS.detail(id),
    queryFn: () => emergenciesApi.getById(id),
    enabled: Boolean(id),
  });
}

// Hook for creating SOS emergency request
export function useCreateEmergency() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateEmergencyPayload) =>
      emergenciesApi.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_KEYS.all });
      toast.success("Emergency SOS Dispatched!", {
        description: `Reference #${data.id.slice(0, 8)}. Dispatch team alerted.`,
      });
      router.push(`/dashboard?active=${data.id}`);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to broadcast SOS request";
      toast.error("SOS Request Failed", { description: message });
    },
  });
}

// Hook for cancelling emergency
export function useCancelEmergency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      emergenciesApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_KEYS.all });
      toast.info("Emergency Request Cancelled");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to cancel emergency";
      toast.error("Cancellation Failed", { description: message });
    },
  });
}
