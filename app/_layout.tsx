import { AnimatedSidebar } from "@/components/sidebar";
import { ToastContainer } from "@/components/toast-container";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { queryClient } from "@/lib/query-client";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useSidebar } from "@/store/sidebarStore";
import { useThemeStore } from "@/store/themeStore";
import { isProviderRole } from "@/utils/user-role";
import { QueryClientProvider } from "@tanstack/react-query";
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
  const { isOpen, closeSidebar } = useSidebar();

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
        <AnimatedSidebar isOpen={isOpen} onClose={closeSidebar} />
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

    const inAuthGroup = segments[0] === "(auth)";
    if (isAuthenticated && user) {
      if (inAuthGroup) {
        const homePath = isProviderRole(user.role)
          ? "/(tabs)/(provider)/services"
          : "/(tabs)/(client)/enrollments";
        router.replace(homePath);
      }
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, segments, user, router, isHydrated]);

  if (!isHydrated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return <Slot />;
}
