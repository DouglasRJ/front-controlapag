import { Poppins_100Thin } from '@expo-google-fonts/poppins/100Thin';
import { Poppins_100Thin_Italic } from '@expo-google-fonts/poppins/100Thin_Italic';
import { Poppins_200ExtraLight } from '@expo-google-fonts/poppins/200ExtraLight';
import { Poppins_200ExtraLight_Italic } from '@expo-google-fonts/poppins/200ExtraLight_Italic';
import { Poppins_300Light } from '@expo-google-fonts/poppins/300Light';
import { Poppins_300Light_Italic } from '@expo-google-fonts/poppins/300Light_Italic';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_400Regular_Italic } from '@expo-google-fonts/poppins/400Regular_Italic';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_500Medium_Italic } from '@expo-google-fonts/poppins/500Medium_Italic';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_600SemiBold_Italic } from '@expo-google-fonts/poppins/600SemiBold_Italic';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { Poppins_700Bold_Italic } from '@expo-google-fonts/poppins/700Bold_Italic';
import { Poppins_800ExtraBold } from '@expo-google-fonts/poppins/800ExtraBold';
import { Poppins_800ExtraBold_Italic } from '@expo-google-fonts/poppins/800ExtraBold_Italic';
import { Poppins_900Black } from '@expo-google-fonts/poppins/900Black';
import { Poppins_900Black_Italic } from '@expo-google-fonts/poppins/900Black_Italic';
import { useFonts } from '@expo-google-fonts/poppins/useFonts';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";


import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
    let [fontsLoaded,fontError] = useFonts({
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
    Poppins_900Black_Italic
  });

  const colorScheme = useColorScheme();
 
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
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
