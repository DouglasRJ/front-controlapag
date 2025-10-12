import { LoginData, RegisterData } from "@/lib/validators/auth";
import api from "@/services/api";
import { User } from "@/types/user";
import { USER_ROLE } from "@/types/user-role";
import axios from "axios";
import { router } from "expo-router";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (data) => {
    try {
      const response = await api.post("/auth", data);
      const { user, token } = response.data;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ user, token, isAuthenticated: true });

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login failed:", error);

      const apiErrorMessage =
        (error as any).response?.data?.message ||
        "Falha no login. Verifique suas credenciais.";

      throw new Error(apiErrorMessage);
    }
  },

  register: async (data) => {
    try {
      switch (data.role) {
        case USER_ROLE.PROVIDER:
          if (!data.providerProfile) {
            throw new Error("Provider profile is necessary");
          }
          await api.post("/auth/register/provider", {
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role,
            title: data.providerProfile.title,
            bio: data.providerProfile.bio,
            address: data.providerProfile.address,
            businessPhone: data.providerProfile.businessPhone,
          });
          router.push("/login");
          break;

        case USER_ROLE.CLIENT:
          if (!data.clientProfile) {
            throw new Error("Client profile is necessary");
          }

          await api.post("/auth/register/client", {
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role,
            address: data.clientProfile.address,
            phone: data.clientProfile.phone,
          });
          router.push("/login");
          break;
        default:
          throw new Error("Invalid Role");
      }
    } catch (error) {
      console.error("Registration failed:", error);

      let displayMessage = "Falha no cadastro. Tente novamente.";

      if (axios.isAxiosError(error) && error.response) {
        const apiErrorMessage = error.response.data.message;

        if (
          apiErrorMessage &&
          typeof apiErrorMessage === "string" &&
          apiErrorMessage.includes(
            "QueryFailedError: duplicate key value violates unique constraint"
          )
        ) {
          displayMessage = "Este email já está em uso.";
        } else if (apiErrorMessage) {
          displayMessage = apiErrorMessage;
        }
      } else if (error instanceof Error) {
        displayMessage = error.message;
      }

      throw new Error(displayMessage);
    }
  },

  logout: () => {
    delete api.defaults.headers.common["Authorization"];
    set({ user: null, token: null, isAuthenticated: false });
    router.replace("/(auth)/login");
  },

  setUser: (user) => {
    set({ user });
  },
}));
