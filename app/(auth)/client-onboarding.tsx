import { ControlledInput } from "@/components/forms/controlled-input";
import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  ClientOnboardingData,
  clientOnboardingSchema,
} from "@/lib/validators/client-onboarding";
import { useAuthStore } from "@/store/authStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
export default function ClientOnboardingScreen() {
  const { token } = useLocalSearchParams<{
    token: string;
  }>();

  const { setInitialPassword } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientOnboardingData>({
    resolver: zodResolver(clientOnboardingSchema),
    defaultValues: {
      token: "",
      username: "",
      newPassword: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
  });
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    setValue("token", token as string);
  }, [token, setValue]);
  const onSubmit = async (data: ClientOnboardingData) => {
    try {
      setIsLoading(true);
      setError(null);
      await setInitialPassword(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao configurar sua conta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ThemedView className="flex-1 justify-center items-center md:p-4">
      <LinearGradient
        colors={["#242120", "#242120", "#242120"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="hidden md:block absolute top-[-80] right-[-40] w-[200] h-[200] rounded-full bg-orange-500/5" />
      <View className="hidden md:block absolute bottom-[-100] left-[-80] w-[250] h-[250] rounded-full bg-orange-500/5" />
      <View className="hidden md:block absolute top-[150] left-[30] w-[100] h-[100] rounded-full bg-orange-500/3" />

      <View
        className={`
          w-full bg-card overflow-hidden flex-1 mb-4
          md:max-w-xl rounded-3xl md:shadow-2xl md:elevation-10 md:max-h-[90%]
        `}
      >
        <View className="h-3 bg-primary" />

        <View className="items-center pt-6 pb-4 px-4 md:px-5">
          <View className="mb-4 w-9 h-9 rounded-lg bg-primary items-center justify-center">
            <MaterialIcons name="person-add" size={20} className="text-white" />
          </View>
          <Logo fontSize={24} />
          <ThemedText className="my-2 text-sm text-gray-600 text-center leading-relaxed">
            Complete seu cadastro e defina sua senha
          </ThemedText>
        </View>

        <ScrollView
          className="flex-1 px-4 md:px-5"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-3 pb-4">
            <View>
              <Text className="text-sm font-semibold text-card-foreground mb-1">
                Nome completo
              </Text>
              <View className="relative">
                <View className="absolute left-3.5 top-3.5 justify-center z-10">
                  <Ionicons name="person-outline" size={20} color="#9ca3af" />
                </View>
                <ControlledInput
                  control={control}
                  name="username"
                  placeholder="João Silva"
                  className="pl-11"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-semibold text-card-foreground mb-1">
                Telefone
              </Text>
              <View className="relative">
                <View className="absolute left-3.5 top-3.5 justify-center z-10">
                  <Ionicons name="call-outline" size={20} color="#9ca3af" />
                </View>
                <ControlledInput
                  control={control}
                  name="phone"
                  placeholder="(11) 98765-4321"
                  keyboardType="phone-pad"
                  maskType="phone"
                  className="pl-11"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-semibold text-card-foreground mb-1">
                Endereço
              </Text>
              <View className="relative">
                <View className="absolute left-3.5 top-3.5 justify-center z-10">
                  <Ionicons name="location-outline" size={20} color="#9ca3af" />
                </View>
                <ControlledInput
                  control={control}
                  name="address"
                  placeholder="Rua, número, bairro, cidade"
                  className="pl-11"
                />
              </View>
            </View>

            <View className="h-px bg-gray-200 my-2" />

            <View>
              <Text className="text-sm font-semibold text-card-foreground mb-1">
                Nova senha
              </Text>
              <View className="relative">
                <View className="absolute left-3.5 top-3.5 justify-center z-10">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                  />
                </View>
                <ControlledInput
                  control={control}
                  name="newPassword"
                  placeholder="••••••••"
                  secureTextEntry
                  className="pl-11"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-semibold text-card-foreground mb-1">
                Confirmar senha
              </Text>
              <View className="relative">
                <View className="absolute left-3.5 top-3.5 justify-center z-10">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                  />
                </View>
                <ControlledInput
                  control={control}
                  name="confirmPassword"
                  placeholder="••••••••"
                  secureTextEntry
                  className="pl-11"
                />
              </View>
            </View>

            {error && (
              <View className="bg-[#FEE2E2] p-4 rounded-lg border border-[#F87171] mt-2">
                <ThemedText className="text-[#B91C1C] text-center font-medium text-xs">
                  {error}
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>

        <View className="px-4 md:px-5 pb-4">
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`bg-orange-500 rounded-xl py-3.5 items-center justify-center shadow-lg shadow-orange-500/30 ${isLoading ? "opacity-70" : "active:bg-orange-600"}`}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold tracking-wide">
                CONCLUIR CADASTRO
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}
