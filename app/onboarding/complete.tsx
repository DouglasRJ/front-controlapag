import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { isProviderRole } from "@/utils/user-role";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const NEXT_STEPS_PROVIDER = [
  {
    icon: "add-circle-outline",
    title: "Criar seu primeiro serviço",
    description: "Adicione os serviços que você oferece",
      action: "/(tabs)/(provider)/services",
  },
  {
    icon: "people-outline",
    title: "Convidar clientes",
    description: "Envie convites para seus clientes",
      action: "/(tabs)/(provider)/enrollments",
  },
  {
    icon: "bar-chart-outline",
    title: "Explorar o dashboard",
    description: "Veja suas métricas e relatórios",
      action: "/(tabs)/(provider)/services",
  },
];

const NEXT_STEPS_CLIENT = [
  {
    icon: "document-text-outline",
    title: "Ver seus contratos",
    description: "Acompanhe seus serviços ativos",
      action: "/(tabs)/(client)/enrollments",
  },
  {
    icon: "card-outline",
    title: "Histórico de pagamentos",
    description: "Veja todos os seus pagamentos",
      action: "/(tabs)/(client)/enrollments",
  },
];

export default function CompleteScreen() {
  const { user } = useAuthStore();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  const userRole = user?.role;
  const isProvider = isProviderRole(userRole);
  const nextSteps = isProvider ? NEXT_STEPS_PROVIDER : NEXT_STEPS_CLIENT;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    if (isProvider) {
      router.replace("/(tabs)/(provider)/services");
    } else {
      router.replace("/(tabs)/(client)/enrollments");
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
                  Tudo pronto!
                </ThemedText>

                <ThemedText className="mt-4 text-base text-gray-300 leading-relaxed">
                  Sua conta foi criada com sucesso. Agora você pode começar a
                  usar todas as funcionalidades do ControlaPAG.
                </ThemedText>

                <View className="mt-8 gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-success-500/20 items-center justify-center">
                      <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Conta verificada e ativa
                    </ThemedText>
                  </View>
                  {isProvider && (
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                        <Ionicons name="card-outline" size={24} color="#FF6B35" />
                      </View>
                      <ThemedText className="flex-1 text-gray-200">
                        Configure pagamentos quando estiver pronto
                      </ThemedText>
                    </View>
                  )}
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-info-500/20 items-center justify-center">
                      <Ionicons name="rocket-outline" size={24} color="#3B82F6" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Pronto para começar
                    </ThemedText>
                  </View>
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
                      <Animated.View
                        style={{
                          transform: [{ scale: scaleAnim }],
                          opacity: fadeAnim,
                        }}
                        className="mb-4 w-20 h-20 rounded-full bg-success-500 items-center justify-center shadow-lg"
                      >
                        <MaterialIcons name="check-circle" size={48} color="white" />
                      </Animated.View>
                      <View className="md:hidden mb-4">
                        <Logo fontSize={26} />
                      </View>
                      <ThemedText className="text-2xl md:text-3xl font-bold text-card-foreground text-center">
                        Conta Criada com Sucesso!
                      </ThemedText>
                      <ThemedText className="mt-2 text-sm text-gray-500 text-center">
                        Bem-vindo ao ControlaPAG. Você está pronto para começar.
                      </ThemedText>
                    </View>

                    {/* Next Steps */}
                    <View className="mb-6">
                      <ThemedText className="text-lg font-semibold text-card-foreground mb-4">
                        Próximos Passos
                      </ThemedText>
                      <View className="gap-3">
                        {nextSteps.map((step, index) => (
                          <Card
                            key={index}
                            className="border border-border bg-card"
                          >
                            <CardContent className="pt-4">
                              <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                                  <Ionicons
                                    name={step.icon as any}
                                    size={20}
                                    className="text-primary"
                                  />
                                </View>
                                <View className="flex-1">
                                  <ThemedText className="text-base font-medium text-card-foreground">
                                    {step.title}
                                  </ThemedText>
                                  <ThemedText className="text-sm text-gray-500">
                                    {step.description}
                                  </ThemedText>
                                </View>
                                <Ionicons
                                  name="chevron-forward"
                                  size={20}
                                  className="text-gray-400"
                                />
                              </View>
                            </CardContent>
                          </Card>
                        ))}
                      </View>
                    </View>

                    {/* Help Card */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-4">
                        <View className="flex-row items-start gap-3">
                          <Ionicons
                            name="help-circle-outline"
                            size={20}
                            className="text-primary flex-shrink-0 mt-0.5"
                          />
                          <View className="flex-1">
                            <ThemedText className="text-sm font-medium text-card-foreground mb-1">
                              Precisa de ajuda?
                            </ThemedText>
                            <ThemedText className="text-xs text-gray-600 leading-relaxed">
                              Nossa equipe está pronta para ajudar. Acesse o menu
                              de ajuda ou entre em contato pelo suporte.
                            </ThemedText>
                          </View>
                        </View>
                      </CardContent>
                    </Card>
                  </View>
                </View>

                <View className="px-6 pb-8 pt-4 md:pb-10 border-t border-t-gray-100">
                  <Button
                    title="COMEÇAR AGORA"
                    onPress={handleGetStarted}
                    size="md"
                    className="w-full mb-4"
                  />

                  {isProvider && (
                    <Button
                      title="CONFIGURAR PAGAMENTOS"
                      onPress={() => router.push("/onboarding/stripe-setup")}
                      variant="outline"
                      size="sm"
                      className="w-full mb-2"
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

