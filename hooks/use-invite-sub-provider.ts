import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { InviteSubProviderData } from "@/types/organization";
import { organizationKeys } from "./use-organization";
import { useOrganization } from "./use-organization";
import { showToast } from "@/store/toastStore";

interface InviteSubProviderParams {
  organizationId: string;
  data: InviteSubProviderData;
}

export function useInviteSubProvider() {
  const queryClient = useQueryClient();
  const { data: organization } = useOrganization();

  return useMutation({
    mutationFn: async ({ organizationId, data }: InviteSubProviderParams) => {
      const response = await api.post(
        `/organization/${organizationId}/invite-sub-provider`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      showToast("Convite enviado com sucesso!", "success");
      // Invalidate organization queries to refresh data
      if (organization?.id) {
        queryClient.invalidateQueries({
          queryKey: organizationKeys.detail(organization.id),
        });
        queryClient.invalidateQueries({
          queryKey: organizationKeys.current(),
        });
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Erro ao enviar convite. Tente novamente.";
      showToast(message, "error");
      throw error;
    },
  });
}

