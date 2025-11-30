import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { USER_ROLE } from "@/types/user-role";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const FEATURES = [
  {
    icon: "calendar-outline",
    title: "Agenda Inteligente",
    description: "Configure horários e permita agendamentos automáticos",
  },
  {
    icon: "card-outline",
    title: "Cobranças Automatizadas",
    description: "Crie cobranças recorrentes com lembretes automáticos",
  },
  {
    icon: "bar-chart-outline",
    title: "Dashboard Financeiro",
    description: "Acompanhe pagamentos em tempo real",
  },
  {
    icon: "notifications-outline",
    title: "Notificações Automáticas",
    description: "Clientes recebem lembretes automaticamente",
  },
];

export default function WelcomeScreen() {
  const [selectedRole, setSelectedRole] = useState<USER_ROLE | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    if (!selectedRole) return;

    // Passa o role selecionado para a tela de registro
    router.push({
      pathname: "/(auth)/register",
      params: { role: selectedRole },
    });
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
                  Bem-vindo ao ControlaPAG
                </ThemedText>

                <ThemedText className="mt-4 text-base text-gray-300 leading-relaxed">
                  A plataforma completa para gerenciar seus serviços, clientes e
                  pagamentos de forma profissional e automatizada.
                </ThemedText>

                <View className="mt-8 gap-4">
                  {FEATURES.map((feature, index) => (
                    <View key={index} className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                        <Ionicons name={feature.icon as any} size={20} color="#FF6B35" />
                      </View>
                      <View className="flex-1">
                        <ThemedText className="text-gray-200 font-medium">
                          {feature.title}
                        </ThemedText>
                        <ThemedText className="text-gray-400 text-sm">
                          {feature.description}
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
                        <MaterialIcons name="rocket-launch" size={32} color="white" />
                      </View>
                      <View className="md:hidden mb-4">
                        <Logo fontSize={26} />
                      </View>
                      <ThemedText className="text-2xl md:text-3xl font-bold text-card-foreground text-center">
                        Bem-vindo ao ControlaPAG
                      </ThemedText>
                      <ThemedText className="mt-2 text-sm text-gray-500 text-center">
                        Escolha o tipo de conta que melhor se encaixa com você
                      </ThemedText>
                    </View>

                    <View className="gap-4 mb-6">
                      {/* Provider Card */}
                      <Pressable
                        onPress={() => setSelectedRole(USER_ROLE.PROVIDER)}
                        className="w-full"
                      >
                        <Card
                          className={`border-2 transition-all ${
                            selectedRole === USER_ROLE.PROVIDER
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <View className="flex-row items-center gap-3 mb-2">
                              <View
                                className={`w-12 h-12 rounded-xl items-center justify-center ${
                                  selectedRole === USER_ROLE.PROVIDER
                                    ? "bg-primary"
                                    : "bg-primary/10"
                                }`}
                              >
                                <Ionicons
                                  name="business-outline"
                                  size={24}
                                  color={
                                    selectedRole === USER_ROLE.PROVIDER
                                      ? "white"
                                      : "#FD5001"
                                  }
                                />
                              </View>
                              <View className="flex-1">
                                <CardTitle className="text-lg">Prestador de Serviço</CardTitle>
                                <CardDescription>
                                  Ofereço serviços e preciso gerenciar clientes
                                </CardDescription>
                              </View>
                              {selectedRole === USER_ROLE.PROVIDER && (
                                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                                  <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                              )}
                            </View>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <View className="gap-2">
                              <View className="flex-row items-center gap-2">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={16}
                                  className="text-primary"
                                />
                                <ThemedText className="text-sm text-card-foreground">
                                  Criar e gerenciar serviços
                                </ThemedText>
                              </View>
                              <View className="flex-row items-center gap-2">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={16}
                                  className="text-primary"
                                />
                                <ThemedText className="text-sm text-card-foreground">
                                  Cobranças automatizadas
                                </ThemedText>
                              </View>
                              <View className="flex-row items-center gap-2">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={16}
                                  className="text-primary"
                                />
                                <ThemedText className="text-sm text-card-foreground">
                                  Dashboard financeiro completo
                                </ThemedText>
                              </View>
                            </View>
                          </CardContent>
                        </Card>
                      </Pressable>

                      {/* Client Card */}
                      <Pressable
                        onPress={() => setSelectedRole(USER_ROLE.CLIENT)}
                        className="w-full"
                      >
                        <Card
                          className={`border-2 transition-all ${
                            selectedRole === USER_ROLE.CLIENT
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <View className="flex-row items-center gap-3 mb-2">
                              <View
                                className={`w-12 h-12 rounded-xl items-center justify-center ${
                                  selectedRole === USER_ROLE.CLIENT
                                    ? "bg-primary"
                                    : "bg-primary/10"
                                }`}
                              >
                                <Ionicons
                                  name="person-outline"
                                  size={24}
                                  color={
                                    selectedRole === USER_ROLE.CLIENT
                                      ? "white"
                                      : "#FD5001"
                                  }
                                />
                              </View>
                              <View className="flex-1">
                                <CardTitle className="text-lg">Cliente</CardTitle>
                                <CardDescription>
                                  Contrato serviços e preciso acompanhar pagamentos
                                </CardDescription>
                              </View>
                              {selectedRole === USER_ROLE.CLIENT && (
                                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                                  <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                              )}
                            </View>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <View className="gap-2">
                              <View className="flex-row items-center gap-2">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={16}
                                  className="text-primary"
                                />
                                <ThemedText className="text-sm text-card-foreground">
                                  Visualizar contratos ativos
                                </ThemedText>
                              </View>
                              <View className="flex-row items-center gap-2">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={16}
                                  className="text-primary"
                                />
                                <ThemedText className="text-sm text-card-foreground">
                                  Acompanhar pagamentos e débitos
                                </ThemedText>
                              </View>
                              <View className="flex-row items-center gap-2">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={16}
                                  className="text-primary"
                                />
                                <ThemedText className="text-sm text-card-foreground">
                                  Receber lembretes automáticos
                                </ThemedText>
                              </View>
                            </View>
                          </CardContent>
                        </Card>
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View className="px-6 pb-8 pt-4 md:pb-10 border-t border-t-gray-100">
                  <Button
                    title="CONTINUAR"
                    onPress={handleContinue}
                    disabled={!selectedRole}
                    size="md"
                    className="w-full mb-4"
                  />

                  <View className="flex-row justify-center items-center">
                    <ThemedText className="text-sm text-gray-500">
                      Já tem uma conta?{" "}
                    </ThemedText>
                    <Pressable onPress={() => router.push("/(auth)/login")}>
                      <ThemedText className="text-sm font-bold text-primary">
                        Faça login
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

