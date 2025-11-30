import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { OrganizationMember } from "@/types/organization";
import { useOrganization } from "./use-organization";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";

// Query keys
export const organizationMembersKeys = {
  all: ["organization-members"] as const,
  byOrganization: (orgId: string) => [...organizationMembersKeys.all, orgId] as const,
};

// Get all members of an organization
// Note: This assumes the API endpoint returns users with organizationId
// We'll need to filter users by organizationId on the client side or create an API endpoint
export function useOrganizationMembers() {
  const isHydrated = useAuthHydration();
  const { data: organization } = useOrganization();

  return useQuery({
    queryKey: organizationMembersKeys.byOrganization(organization?.id || ""),
    queryFn: async () => {
      if (!organization?.id) {
        throw new Error("Organization ID is required");
      }

      // Fetch all users and filter by organizationId
      // TODO: Replace with dedicated endpoint like GET /organization/:id/members
      const response = await api.get<User[]>("/user");
      const members = response.data
        .filter(
          (user) =>
            user.providerProfile?.organizationId === organization.id ||
            user.organizationId === organization.id
        )
        .map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          image: user.image,
        })) as OrganizationMember[];

      return members;
    },
    enabled: isHydrated && !!organization?.id,
  });
}

