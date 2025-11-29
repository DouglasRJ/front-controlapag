import React, { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  View,
} from "react-native";

type StripeOnboardingModalProps = {
  visible: boolean;
};

export function StripeOnboardingModal({ visible }: StripeOnboardingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();
  const colorScheme = useColorScheme();
  const cardBackgroundColor = Colors[colorScheme ?? "light"].card;

  const handleOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await api.post<{ url: string }>(
        "/provider/connect-account",
        {}
      );
      const url = response.data.url;
      if (Platform.OS === "web") {
        window.open(url, "_self");
      } else {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.warn(
            "Não foi possível abrir a URL com Linking, tentando WebBrowser."
          );
          await WebBrowser.openBrowserAsync(url);
        }
      }
    } catch (error: any) {
      console.error("Onboarding error:", error);
      const message =
        error.response?.data?.message ||
        "Ocorreu um erro ao buscar o link de configuração.";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={false}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View className="flex-1 justify-center items-center bg-black/60 p-6">
        <View
          className="w-full max-w-md bg-card rounded-xl p-6 items-center shadow-lg"
          style={{ minHeight: 300, backgroundColor: cardBackgroundColor }}
        >
          <ThemedText className="text-2xl font-bold text-center mt-4 text-foreground">
            Ação Necessária
          </ThemedText>

          <ThemedText className="text-base text-center mt-3 text-muted-foreground">
            Para ativar sua conta e receber pagamentos, precisamos que configure
            sua conta de pagamentos com nosso parceiro, Stripe.
          </ThemedText>

          <Button
            title={isLoading ? "Carregando" : "Configurar Pagamentos"}
            onPress={handleOnboarding}
            disabled={isLoading}
            className="w-full mt-6"
          >
            {isLoading && <ActivityIndicator />}
          </Button>

          <Button
            title="Sair"
            onPress={logout}
            variant="link"
            className="mt-2"
          />
        </View>
      </View>
    </Modal>
  );
}
