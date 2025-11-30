import api from "@/services/api";
import { Charge } from "@/types/charge";
import { chargeKeys } from "@/hooks/use-charges";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface RefundChargeParams {
  chargeId: string;
  amount?: number;
  reason?: string;
}

export function useChargeRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chargeId, amount, reason }: RefundChargeParams) => {
      const response = await api.post<Charge>(`/charge/${chargeId}/refund`, {
        amount,
        reason,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate charge queries
      queryClient.invalidateQueries({ queryKey: chargeKeys.all });
      queryClient.invalidateQueries({ queryKey: chargeKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: chargeKeys.byEnrollment(data.enrollmentId) });
    },
  });
}

