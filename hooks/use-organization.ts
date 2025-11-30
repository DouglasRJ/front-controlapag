import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Organization } from "@/types/organization";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const organizationKeys = {
  all: ["organization"] as const,
  detail: (id: string) => [...organizationKeys.all, id] as const,
  current: () => [...organizationKeys.all, "current"] as const,
};

// Get current user's organization
export function useOrganization() {
  const isHydrated = useAuthHydration();
  const { user } = useAuthStore();

  // Get organizationId from providerProfile or user
  const organizationId =
    (user?.providerProfile as any)?.organizationId || user?.organizationId;

  return useQuery({
    queryKey: organizationKeys.current(),
    queryFn: async () => {
      if (!organizationId) {
        throw new Error("User does not have an organization");
      }
      const response = await api.get<Organization>(`/organization/${organizationId}`);
      return response.data;
    },
    enabled: isHydrated && !!organizationId,
  });
}

// Get organization by ID
export function useOrganizationById(id: string | undefined) {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: organizationKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) {
        throw new Error("Organization ID is required");
      }
      const response = await api.get<Organization>(`/organization/${id}`);
      return response.data;
    },
    enabled: isHydrated && !!id,
  });
}

