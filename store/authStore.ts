import { LoginData, RegisterData } from "@/lib/validators/auth";
import api from "@/services/api";
import { User } from "@/types/user";
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
      const response = await api.post("/auth/login", data);
      const { user, token } = response.data;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ user, token, isAuthenticated: true });

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  register: async (data) => {
    try {
      await api.post("/auth/register", data);
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
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
