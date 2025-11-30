// Sidebar antiga removida - agora usamos DashboardSidebar no layout do dashboard
import { ToastContainer } from "@/components/toast-container";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { queryClient } from "@/lib/query-client";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
// Sidebar store ainda usado no dashboard layout
import { useThemeStore } from "@/store/themeStore";
import { isProviderRole } from "@/utils/user-role";
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins/useFonts";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const themeHasHydrated = useThemeStore((state) => state._hasHydrated);
  const rootViewRef = useRef<View>(null);
  // Sidebar agora gerenciada no dashboard layout

  const [fontsLoaded, fontError] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  useEffect(() => {
    const initialToken = useAuthStore.getState().token;
    if (initialToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
    }
    const unsubscribe = useAuthStore.subscribe((state) => {
      const token = state.token;
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common["Authorization"];
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && themeHasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, themeHasHydrated]);

  if ((!fontsLoaded && !fontError) || !themeHasHydrated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <View
        ref={rootViewRef}
        className={`flex-1 ${colorScheme === "dark" ? "dark" : ""} transition-colors duration-300 ease-in-out`}
        style={{ flex: 1 }}
      >
        <InitialLayout />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <ToastContainer />
      </View>
    </QueryClientProvider>
  );
}

function InitialLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const isHydrated = useAuthHydration();

  useEffect(() => {
    if (!isHydrated) return;

    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === "(auth)";
    const inTabsGroup = firstSegment === "(tabs)";

    // Se não autenticado e tentando acessar tabs, redireciona para home
    if (!isAuthenticated && inTabsGroup) {
      router.replace("/(tabs)" as any);
      return;
    }

    // Se autenticado e está em auth, redireciona para tabs
    if (isAuthenticated && user && inAuthGroup) {
      const homePath = isProviderRole(user.role)
        ? "/(tabs)/(provider)/services"
        : "/(tabs)/(client)/enrollments";
      router.replace(homePath);
      return;
    }

    // Garantir que se estiver no tabs mas na rota errada após login (ex: analytics), redireciona para a rota correta
    // Só faz isso se estiver especificamente em analytics e for provider
    if (isAuthenticated && user && inTabsGroup) {
      const currentPath = segments.join("/");
      const isProvider = isProviderRole(user.role);

      // Se for provider e estiver em analytics (rota que não deveria ser a inicial), redireciona para services
      if (isProvider && currentPath.includes("analytics") && segments.length > 0 && segments[segments.length - 1] === "analytics") {
        router.replace("/(tabs)/(provider)/services");
      }
    }
  }, [isAuthenticated, segments, user, isHydrated, router]);

  if (!isHydrated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return <Slot />;
}
