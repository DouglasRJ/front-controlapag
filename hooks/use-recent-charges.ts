import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Charge } from "@/types/charge";
import { useQuery } from "@tanstack/react-query";
import { chargeKeys } from "./use-charges";

export function useRecentCharges(limit: number = 10) {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: [...chargeKeys.all, "recent", limit],
    queryFn: async () => {
      const response = await api.get<Charge[]>("/charge");
      // Sort by createdAt descending and limit
      const sorted = response.data
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        })
        .slice(0, limit);
      return sorted;
    },
    enabled: isHydrated,
  });
}

