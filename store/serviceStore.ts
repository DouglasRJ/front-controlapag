import { NewServiceFormData } from "@/lib/validators/service";
import api from "@/services/api";
import { Service } from "@/types/service";
import { create } from "zustand";
interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
}
interface ServiceActions {
  fetchServices: (query: string, status: string) => Promise<void>;
  createService: (data: NewServiceFormData) => Promise<Service>;
}
const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null
};
export const useServiceStore = create<ServiceState & ServiceActions>()(set => ({
  ...initialState,
  fetchServices: async (query: string, status: string) => {
    set({
      loading: true,
      error: null
    });
    try {
      let isActiveFilter: boolean | undefined;
      if (status === "actives") {
        isActiveFilter = true;
      } else if (status === "inactives") {
        isActiveFilter = false;
      }
      const params = {
        q: query || undefined,
        isActive: isActiveFilter !== undefined ? isActiveFilter : undefined
      };
      const response = await api.get<Service[]>("/provider/services", {
        params
      });
      set({
        services: response.data,
        loading: false
      });
    } catch (err) {
      console.error(err);
      set({
        error: "Não foi possível carregar ou buscar os serviços.",
        loading: false
      });
    }
  },
  createService: async (data: NewServiceFormData) => {
    try {
      const priceAsNumber = data.defaultPrice ? parseFloat(data.defaultPrice.replace(/[^0-9,-]/g, "").replace(",", ".")) : undefined;
      const payload = {
        name: data.name,
        description: data.description,
        address: data.hasFixedLocation ? data.address : undefined,
        defaultPrice: data.hasFixedPrice ? priceAsNumber : undefined,
        allowedPaymentMethods: data.allowedPaymentMethods,
        isRecurrent: data.isRecurrent
      };
      const response = await api.post<Service>("/service", payload);
      set(state => ({
        services: [response.data, ...state.services]
      }));
      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("Não foi possível criar o serviço.");
    }
  }
}));