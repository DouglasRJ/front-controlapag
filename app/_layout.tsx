import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { useColorScheme } from "@/hooks/use-color-scheme";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
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
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  const colorScheme = useColorScheme();

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

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View className="w-full -mt-20">
        <InitialLayout />
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

function InitialLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const isHydrated = useAuthHydration();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    if (isAuthenticated && user) {
      if (inAuthGroup) {
        const homePath =
          user.role === USER_ROLE.PROVIDER
            ? "/(tabs)/(provider)/services"
            : "/(tabs)/(client)/charges";
        router.replace(homePath);
      }
    } else if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, segments, user, router, isHydrated]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
