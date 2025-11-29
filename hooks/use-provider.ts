import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { OperationalMetrics } from "@/types/operational-metrics";
import { Provider } from "@/types/provider";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const providerKeys = {
  all: ["provider"] as const,
  profile: () => [...providerKeys.all, "profile"] as const,
  metrics: () => [...providerKeys.all, "metrics"] as const,
  operationalMetrics: () => [...providerKeys.all, "operational-metrics"] as const,
};

// Provider profile
export function useProviderProfile() {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: providerKeys.profile(),
    queryFn: async () => {
      const response = await api.get<Provider>("/provider/profile");
      return response.data;
    },
    enabled: isHydrated,
  });
}

// Operational metrics (dashboard)
export function useOperationalMetrics() {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: providerKeys.operationalMetrics(),
    queryFn: async () => {
      const response = await api.get<OperationalMetrics>(
        "/dashboard/operational-metrics"
      );
      return response.data;
    },
    enabled: isHydrated,
  });
}

