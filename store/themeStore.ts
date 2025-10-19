// store/themeStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  colorScheme: Theme;
  setColorScheme: (scheme: Theme) => void;
  toggleColorScheme: () => void;
  _hasHydrated: boolean; // Para saber se a store foi carregada do storage
  setHasHydrated: (state: boolean) => void;
}

// Tenta pegar o tema inicial do dispositivo
const initialDeviceScheme = Appearance.getColorScheme() ?? "light";

export const useThemeStore = create(
  persist<ThemeState>(
    (set, get) => ({
      colorScheme: initialDeviceScheme, // Inicia com o tema do dispositivo
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      // Apenas atualiza o estado interno da store
      setColorScheme: (scheme) => {
        set({ colorScheme: scheme });
      },
      // Apenas atualiza o estado interno da store
      toggleColorScheme: () => {
        const newScheme = get().colorScheme === "light" ? "dark" : "light";
        set({ colorScheme: newScheme });
      },
    }),
    {
      name: "theme-storage", // Nome da chave no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Apenas marca como hidratado após carregar do storage
        state?.setHasHydrated(true);
      },
      // Seleciona apenas o 'colorScheme' para ser persistido
      partialize: (state) => ({ colorScheme: state.colorScheme }),
    }
  )
);

// Define um estado inicial antes da hidratação começar,
// lendo diretamente do Appearance uma única vez.
// Isso evita chamar setState desnecessariamente depois.
const currentState = Appearance.getColorScheme() ?? "light";
if (
  useThemeStore.getState().colorScheme !== currentState &&
  !useThemeStore.getState()._hasHydrated
) {
  useThemeStore.setState({ colorScheme: currentState });
}
