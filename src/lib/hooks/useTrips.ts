import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  tripsApi,
  type TripFilterParams,
  type UpdateTripStatusPayload,
  type CreateTripPayload,
} from "@/lib/api/trips";
import { toast } from "sonner";
import { AMBULANCE_KEYS } from "./useAmbulances";
import { EMERGENCY_KEYS } from "./useEmergencies";

export const TRIP_KEYS = {
  all: ["trips"] as const,
  active: () => [...TRIP_KEYS.all, "active"] as const,
  lists: () => [...TRIP_KEYS.all, "list"] as const,
  list: (params?: TripFilterParams) => [...TRIP_KEYS.lists(), params] as const,
  details: () => [...TRIP_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TRIP_KEYS.details(), id] as const,
};

// Hook for fetching user's current active trip
export function useActiveTrip() {
  return useQuery({
    queryKey: TRIP_KEYS.active(),
    queryFn: () => tripsApi.getActive(),
    refetchInterval: 5000, // 5s fast polling for active live trip
  });
}

// Hook for listing trips
export function useTrips(params?: TripFilterParams) {
  return useQuery({
    queryKey: TRIP_KEYS.list(params),
    queryFn: () => tripsApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}

// Hook for single trip
export function useTrip(id: string) {
  return useQuery({
    queryKey: TRIP_KEYS.detail(id),
    queryFn: () => tripsApi.getById(id),
    enabled: Boolean(id),
  });
}

// Mutation: Admin dispatch trip
export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTripPayload) => tripsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
      queryClient.invalidateQueries({ queryKey: EMERGENCY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: AMBULANCE_KEYS.all });
      toast.success("Ambulance Dispatched!", {
        description: "Assigned vehicle and notified driver.",
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to dispatch ambulance";
      toast.error("Dispatch Failed", { description: message });
    },
  });
}

// Mutation: Driver update milestone status
export function useUpdateTripStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTripStatusPayload;
    }) => tripsApi.updateStatus(id, payload),
    onSuccess: (updatedTrip) => {
      queryClient.setQueryData(TRIP_KEYS.active(), updatedTrip);
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
      toast.success("Trip Milestone Updated", {
        description: `Current status: ${updatedTrip.status}`,
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update trip milestone";
      toast.error("Status Update Failed", { description: message });
    },
  });
}
