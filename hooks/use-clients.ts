import api from "@/services/api";
import { Client } from "@/types/client";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (search?: string) => [...clientKeys.lists(), search] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  search: (query: string) => [...clientKeys.all, "search", query] as const,
};

// Search clients (used in searchable select)
export function useSearchClients(query: string) {
  return useQuery({
    queryKey: clientKeys.search(query),
    queryFn: async () => {
      if (query.length < 2) return [];
      const response = await api.get<Client[]>("/client", {
        params: { search: query },
      });
      return response.data;
    },
    enabled: query.length >= 2,
  });
}

// Single client
export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: clientKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Client ID is required");
      const response = await api.get<Client>(`/client/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

