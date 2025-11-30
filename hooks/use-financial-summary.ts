import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface Balance {
  available: number;
  pending: number;
}

export interface Payout {
  id: string;
  amount: number;
  arrival_date: string;
  status: string;
}

export interface FinancialSummary {
  balance: Balance;
  recentPayouts: Payout[];
}

// Query keys
export const financialKeys = {
  all: ["financial"] as const,
  summary: () => [...financialKeys.all, "summary"] as const,
};

export function useFinancialSummary() {
  const isHydrated = useAuthHydration();

  return useQuery({
    queryKey: financialKeys.summary(),
    queryFn: async () => {
      const response = await api.get<FinancialSummary>(
        "/dashboard/financial-summary"
      );
      return response.data;
    },
    enabled: isHydrated,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}

