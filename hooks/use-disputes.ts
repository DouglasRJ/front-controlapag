import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { useQuery } from "@tanstack/react-query";
import { chargeKeys } from "./use-charges";

export function useDisputes() {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: [...chargeKeys.all, "disputes"],
    queryFn: async () => {
      const response = await api.get<Charge[]>("/charge");
      // Filter charges with IN_DISPUTE status
      return response.data.filter(
        (charge) => charge.status === CHARGE_STATUS.IN_DISPUTE
      );
    },
    enabled: isHydrated,
  });
}

