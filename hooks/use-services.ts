import { NewServiceFormData } from "@/lib/validators/service";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Service } from "@/types/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (filters?: { q?: string; isActive?: boolean }) =>
    [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
  provider: () => [...serviceKeys.all, "provider"] as const,
};

// Provider services
export function useProviderServices(filters?: {
  q?: string;
  isActive?: boolean;
}) {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (filters?.q) params.q = filters.q;
      if (filters?.isActive !== undefined) params.isActive = filters.isActive;

      const response = await api.get<Service[]>("/provider/services", {
        params,
      });
      return response.data;
    },
    enabled: isHydrated,
  });
}

// Single service
export function useService(id: string | undefined) {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: serviceKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Service ID is required");
      const response = await api.get<Service>(`/service/${id}`);
      return response.data;
    },
    enabled: isHydrated && !!id,
  });
}

// Create service mutation
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewServiceFormData) => {
      const priceAsNumber = data.defaultPrice
        ? parseFloat(
            data.defaultPrice.replace(/[^0-9,-]/g, "").replace(",", ".")
          )
        : undefined;

      const payload = {
        name: data.name,
        description: data.description,
        address: data.hasFixedLocation ? data.address : undefined,
        defaultPrice: data.hasFixedPrice ? priceAsNumber : undefined,
        allowedPaymentMethods: data.allowedPaymentMethods,
        isRecurrent: data.isRecurrent,
      };

      const response = await api.post<Service>("/service", payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.provider() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

// Update service mutation
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NewServiceFormData>;
    }) => {
      const priceAsNumber = data.defaultPrice
        ? parseFloat(
            data.defaultPrice.replace(/[^0-9,-]/g, "").replace(",", ".")
          )
        : undefined;

      const payload: any = {};
      if (data.name) payload.name = data.name;
      if (data.description) payload.description = data.description;
      if (data.hasFixedLocation !== undefined) {
        payload.address = data.hasFixedLocation ? data.address : undefined;
      }
      if (data.hasFixedPrice !== undefined) {
        payload.defaultPrice = data.hasFixedPrice ? priceAsNumber : undefined;
      }
      if (data.allowedPaymentMethods)
        payload.allowedPaymentMethods = data.allowedPaymentMethods;
      if (data.isRecurrent !== undefined)
        payload.isRecurrent = data.isRecurrent;

      const response = await api.patch<Service>(`/service/${id}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: serviceKeys.provider() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

// Delete service mutation
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/service/${id}`);
      return id;
    },
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.provider() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

