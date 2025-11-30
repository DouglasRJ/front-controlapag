import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { useQuery } from "@tanstack/react-query";
import { chargeKeys } from "./use-charges";

export interface UseAllChargesOptions {
  status?: CHARGE_STATUS;
  enrollmentId?: string;
}

export function useAllCharges(options?: UseAllChargesOptions) {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: [...chargeKeys.all, "list", options],
    queryFn: async () => {
      const response = await api.get<Charge[]>("/charge");
      let charges = response.data;

      // Filter by status if provided
      if (options?.status) {
        charges = charges.filter((charge) => charge.status === options.status);
      }

      // Filter by enrollmentId if provided
      if (options?.enrollmentId) {
        charges = charges.filter(
          (charge) => charge.enrollmentId === options.enrollmentId
        );
      }

      // Sort by dueDate descending (most recent first)
      return charges.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return dateB - dateA;
      });
    },
    enabled: isHydrated,
  });
}

