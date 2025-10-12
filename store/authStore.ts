import { LoginData, RegisterData } from "@/lib/validators/auth";
import api from "@/services/api";
import { User } from "@/types/user";
import { USER_ROLE } from "@/types/user-role";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (data: LoginData) => {
        try {
          const response = await api.post("/auth", data);

          const { user, accessToken } = response.data;

          api.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          set({ user, token: accessToken, isAuthenticated: true });
        } catch (error) {
          console.error("Login failed:", error);

          let apiErrorMessage = "Falha no login. Verifique suas credenciais.";
          if (isAxiosError(error) && error.response?.data?.message) {
            apiErrorMessage = error.response.data.message;
          }

          throw new Error(apiErrorMessage);
        }
      },

      register: async (data: RegisterData) => {
        try {
          let response: any;

          switch (data.role) {
            case USER_ROLE.PROVIDER:
              if (!data.providerProfile) {
                throw new Error("Provider profile is necessary");
              }
              response = await api.post("/auth/register/provider", {
                email: data.email,
                username: data.username,
                password: data.password,
                role: data.role,
                ...data.providerProfile,
              });
              break;

            case USER_ROLE.CLIENT:
              if (!data.clientProfile) {
                throw new Error("Client profile is necessary");
              }
              response = await api.post("/auth/register/client", {
                email: data.email,
                username: data.username,
                password: data.password,
                role: data.role,
                ...data.clientProfile,
              });
              break;

            default:
              throw new Error("Invalid Role");
          }

          const { user: registeredUser, accessToken: registeredToken } =
            response.data;
          api.defaults.headers.common["Authorization"] =
            `Bearer ${registeredToken}`;
          set({
            user: registeredUser,
            token: registeredToken,
            isAuthenticated: true,
          });
          router.replace("/(tabs)");
        } catch (error) {
          console.error("Registration failed:", error);

          let displayMessage = "Falha no cadastro. Tente novamente.";

          if (isAxiosError(error) && error.response) {
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

      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage as any),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: (state) => {
        return (restoredState: AuthState | undefined) => {
          if (restoredState?.token) {
            api.defaults.headers.common["Authorization"] =
              `Bearer ${restoredState.token}`;
          }
        };
      },
    }
  )
);
