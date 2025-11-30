import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function ProviderIndexScreen() {
  useEffect(() => {
    // Redireciona imediatamente para services quando acessa a rota base do provider
    router.replace("/(tabs)/(provider)/services");
  }, []);

  return <View className="flex-1 bg-background" />;
}

