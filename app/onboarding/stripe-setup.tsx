import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const STRIPE_STEPS = [
  {
    id: 1,
    title: "Informações Básicas",
    description: "Nome, email e telefone da sua conta",
    icon: "person-outline",
  },
  {
    id: 2,
    title: "Dados Bancários",
    description: "Conta onde você receberá os pagamentos",
    icon: "card-outline",
  },
  {
    id: 3,
    title: "Verificação de Identidade",
    description: "Documentos para validação da conta",
    icon: "shield-checkmark-outline",
  },
  {
    id: 4,
    title: "Revisão e Ativação",
    description: "Confirme todas as informações",
    icon: "checkmark-circle-outline",
  },
];

export default function StripeSetupScreen() {
  const { logout, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnboarding = async () => {
    setIsLoading(true);
    setError(null);
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
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1">
      <LinearGradient
        colors={["#242120", "#2d2d2d", "#242120"]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-1 md:flex-row md:max-w-6xl md:mx-auto md:w-full">
            {/* Left side - Desktop only */}
            <View className="hidden md:flex md:flex-1 md:justify-center md:items-center md:p-12 md:relative">
              <View className="absolute w-[300px] h-[300px] rounded-full bg-orange-500/10 top-[-100px] right-[-80px]" />
              <View className="absolute w-[200px] h-[200px] rounded-full bg-orange-500/5 bottom-[-60px] left-[-40px]" />

              <View className="relative z-10 max-w-md">
                <Logo fontSize={36} />

                <ThemedText className="mt-6 text-2xl font-bold text-white leading-tight">
                  Configure seus Pagamentos
                </ThemedText>

                <ThemedText className="mt-4 text-base text-gray-300 leading-relaxed">
                  Para receber pagamentos de forma segura, precisamos conectar
                  sua conta com o Stripe, nosso parceiro de pagamentos.
                </ThemedText>

                <View className="mt-8 gap-4">
                  {STRIPE_STEPS.map((step) => (
                    <View key={step.id} className="flex-row items-start gap-3">
                      <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center flex-shrink-0">
                        <Ionicons name={step.icon as any} size={20} color="#FF6B35" />
                      </View>
                      <View className="flex-1">
                        <ThemedText className="text-gray-200 font-medium">
                          {step.title}
                        </ThemedText>
                        <ThemedText className="text-gray-400 text-sm">
                          {step.description}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Right side - Main content */}
            <View className="flex-1 md:flex md:justify-center md:items-center md:p-8">
              <View className="w-full md:max-w-md bg-card md:rounded-3xl md:shadow-2xl overflow-hidden min-h-full md:min-h-[650px] md:flex md:flex-col">
                <View className="h-2 bg-primary md:hidden" />

                <View className="flex-1 px-6 pt-12 pb-6 md:pt-8 md:pb-6 md:flex md:flex-col md:justify-between">
                  <View>
                    <View className="items-center mb-8">
                      <View className="mb-4 w-16 h-16 rounded-2xl bg-primary items-center justify-center shadow-lg">
                        <MaterialIcons name="account-balance-wallet" size={32} color="white" />
                      </View>
                      <View className="md:hidden mb-4">
                        <Logo fontSize={26} />
                      </View>
                      <ThemedText className="text-2xl md:text-3xl font-bold text-card-foreground text-center">
                        Configuração de Pagamentos
                      </ThemedText>
                      <ThemedText className="mt-2 text-sm text-gray-500 text-center">
                        Conecte sua conta Stripe para começar a receber pagamentos
                      </ThemedText>
                    </View>

                    {/* Steps */}
                    <View className="gap-4 mb-6">
                      {STRIPE_STEPS.map((step, index) => (
                        <Card
                          key={step.id}
                          className="border border-border bg-card"
                        >
                          <CardHeader className="pb-3">
                            <View className="flex-row items-center gap-3">
                              <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                                <Ionicons
                                  name={step.icon as any}
                                  size={20}
                                  className="text-primary"
                                />
                              </View>
                              <View className="flex-1">
                                <CardTitle className="text-base">
                                  {step.title}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {step.description}
                                </CardDescription>
                              </View>
                              <View className="w-6 h-6 rounded-full bg-primary/20 items-center justify-center">
                                <ThemedText className="text-xs font-bold text-primary">
                                  {step.id}
                                </ThemedText>
                              </View>
                            </View>
                          </CardHeader>
                        </Card>
                      ))}
                    </View>

                    {/* Info Card */}
                    <Card className="bg-info-50 border-info-200">
                      <CardContent className="pt-4">
                        <View className="flex-row items-start gap-3">
                          <Ionicons
                            name="information-circle"
                            size={20}
                            className="text-info-600 flex-shrink-0 mt-0.5"
                          />
                          <View className="flex-1">
                            <ThemedText className="text-sm font-medium text-info-900 mb-1">
                              Processo Seguro
                            </ThemedText>
                            <ThemedText className="text-xs text-info-700 leading-relaxed">
                              Todas as informações são processadas diretamente pelo
                              Stripe, uma das maiores plataformas de pagamento do
                              mundo. Seus dados estão seguros.
                            </ThemedText>
                          </View>
                        </View>
                      </CardContent>
                    </Card>

                    {error && (
                      <View className="mt-4 flex-row items-center bg-error-50 py-3 px-4 rounded-xl gap-2 border border-error-200">
                        <Ionicons
                          name="alert-circle"
                          size={18}
                          color="#DC2626"
                        />
                        <ThemedText className="flex-1 text-error-600 text-sm font-medium">
                          {error}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                <View className="px-6 pb-8 pt-4 md:pb-10 border-t border-t-gray-100">
                  <Button
                    title={isLoading ? "CARREGANDO..." : "INICIAR CONFIGURAÇÃO"}
                    onPress={handleOnboarding}
                    disabled={isLoading}
                    size="md"
                    className="w-full mb-4"
                  />

                  <Button
                    title="PULAR POR ENQUANTO"
                    onPress={() => router.back()}
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

