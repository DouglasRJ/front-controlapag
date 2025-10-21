import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LoginData } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuthStore();

  const [loginError, setLoginError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data);
    } catch {
      setLoginError(true);
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
          md:max-w-xl rounded-3xl md:shadow-2xl md:elevation-10 md:max-h-[80%]
        `}
      >
        <View className="h-3 bg-primary" />

        <View className="items-center pt-6 pb-4 px-4 md:px-5">
          <View className="mb-4 w-9 h-9 rounded-lg bg-primary items-center justify-center">
            <MaterialIcons
              name="attach-money"
              size={20}
              className="text-white"
            />
          </View>
          <Logo fontSize={24} />
          <ThemedText className="my-2 text-sm text-gray-600 text-center leading-relaxed">
            Entre na sua conta para gerenciar seus serviços
          </ThemedText>
        </View>

        <View className="flex-1 px-4 md:px-5 justify-between">
          <View className="gap-3">
            <View>
              <Text className="text-sm font-semibold text-card-foreground mb-1">
                Email
              </Text>
              <View className="relative">
                <View className="absolute left-3.5 top-3.5 justify-center z-10">
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                </View>
                <ControlledInput
                  control={control}
                  name="email"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="pl-11"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-semibold text-card-foreground mb-1">
                Senha
              </Text>
              <View className="flex-row relative items-center">
                <View className="absolute left-3.5 top-3.5 justify-center z-10">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                  />
                </View>
                <ControlledInput
                  control={control}
                  name="password"
                  placeholder="••••••••"
                  secureTextEntry
                  className="pl-11"
                />
              </View>
            </View>
            {loginError && (
              <View className="bg-[#FEE2E2] p-4 rounded-lg border border-[#F87171]">
                <ThemedText className="text-[#B91C1C] text-center font-medium text-xs">
                  Falha no login. Verifique suas credenciais.
                </ThemedText>
              </View>
            )}
            <View className="flex-row justify-between items-center mt-1 mb-2">
              <View className="flex-row items-center gap-2">
                <ControlledCheckbox
                  label="Lembrar Senha"
                  control={control}
                  name="rememberMe"
                  labelReverse
                  colorText="text-card-foreground"
                />
              </View>
              <Link href="/forgot-password" asChild>
                <Pressable>
                  <Text className="text-xs text-primary font-semibold underline">
                    Esqueci a senha
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <View className="pb-4">
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-orange-500 rounded-xl py-3.5 items-center justify-center active:bg-orange-600 shadow-lg shadow-orange-500/30"
            >
              <Text className="text-white text-base font-bold tracking-wide">
                {isLoading ? "ENTRANDO..." : "ENTRAR"}
              </Text>
            </Pressable>

            <View className="flex-row justify-center items-center gap-1 mt-3">
              <Text className="text-xs text-gray-600 font-normal">
                Ainda não tem uma conta?
              </Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text className="text-xs text-orange-500 font-bold">
                    Cadastre-se
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-2 mb-8">
        <Text className="text-xs text-gray-400 text-center">
          Ao continuar, você concorda com nossos Termos de Serviço
        </Text>
      </View>
    </ThemedView>
  );
}
