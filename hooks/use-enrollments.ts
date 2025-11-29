import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { CreateEnrollmentDto, Enrollments } from "@/types/enrollments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const enrollmentKeys = {
  all: ["enrollments"] as const,
  lists: () => [...enrollmentKeys.all, "list"] as const,
  list: (filters?: { q?: string; isActive?: boolean }) =>
    [...enrollmentKeys.lists(), filters] as const,
  details: () => [...enrollmentKeys.all, "detail"] as const,
  detail: (id: string) => [...enrollmentKeys.details(), id] as const,
  provider: () => [...enrollmentKeys.all, "provider"] as const,
  client: () => [...enrollmentKeys.all, "client"] as const,
};

// Provider enrollments
export function useProviderEnrollments() {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: enrollmentKeys.provider(),
    queryFn: async () => {
      const response = await api.get<Enrollments[]>("/provider/enrollments");
      return response.data;
    },
    enabled: isHydrated,
  });
}

// Client enrollments
export function useClientEnrollments(filters?: {
  q?: string;
  isActive?: boolean;
}) {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: enrollmentKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (filters?.q) params.q = filters.q;
      if (filters?.isActive !== undefined) params.isActive = filters.isActive;

      const response = await api.get<Enrollments[]>("/client/enrollments", {
        params,
      });
      return response.data;
    },
    enabled: isHydrated,
  });
}

// Single enrollment
export function useEnrollment(id: string | undefined) {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: enrollmentKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Enrollment ID is required");
      const response = await api.get<Enrollments>(`/enrollments/${id}`);
      return response.data;
    },
    enabled: isHydrated && !!id,
  });
}

// Create enrollment mutation
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEnrollmentDto) => {
      const response = await api.post<Enrollments>("/enrollments", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.provider() });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.client() });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
    },
  });
}

// Update enrollment mutation
export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateEnrollmentDto>;
    }) => {
      const response = await api.patch<Enrollments>(`/enrollments/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.provider() });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.client() });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
    },
  });
}

