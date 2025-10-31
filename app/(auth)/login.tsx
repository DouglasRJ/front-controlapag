import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { LoginData } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setLoginError(false);
      await login(data);
    } catch {
      setLoginError(true);
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
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <View className="flex-1 md:flex-row md:max-w-6xl md:mx-auto md:w-full">
            <View className="hidden md:flex md:flex-1 md:justify-center md:items-center md:p-12 md:relative">
              <View className="absolute w-[300px] h-[300px] rounded-full bg-orange-500/10 top-[-100px] right-[-80px]" />
              <View className="absolute w-[200px] h-[200px] rounded-full bg-orange-500/5 bottom-[-60px] left-[-40px]" />

              <View className="relative z-10 max-w-md">
                <Logo fontSize={36} />

                <ThemedText className="mt-6 text-2xl font-bold text-white leading-tight">
                  Gerencie seus serviços de forma simples
                </ThemedText>

                <ThemedText className="mt-4 text-base text-gray-300 leading-relaxed">
                  Conecte-se com clientes, organize pagamentos e controle tudo
                  em um só lugar.
                </ThemedText>

                <View className="mt-8 gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Gestão completa de pagamentos
                    </ThemedText>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Controle de clientes e serviços
                    </ThemedText>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Relatórios e estatísticas
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-1 md:flex md:justify-center md:items-center md:p-8">
              <View className="w-full md:max-w-md bg-card md:rounded-3xl md:shadow-2xl overflow-hidden min-h-full md:min-h-[650px] md:flex md:flex-col">
                <View className="h-2 bg-primary md:hidden" />

                <View className="flex-1 px-6 pt-12 pb-6 md:pt-8 md:pb-6 md:flex md:flex-col md:justify-between">
                  <View>
                    <View className="items-center mb-6">
                      <View className="mb-3 w-12 h-12 rounded-2xl bg-primary items-center justify-center shadow-lg md:hidden">
                        <MaterialIcons
                          name="attach-money"
                          size={24}
                          color="white"
                        />
                      </View>
                      <View className="md:hidden">
                        <Logo fontSize={26} />
                      </View>
                      <ThemedText className="mt-2 text-xl font-bold text-card-foreground md:text-2xl md:mt-0">
                        Bem-vindo de volta
                      </ThemedText>
                      <ThemedText className="mt-2 text-sm text-gray-500 text-center">
                        Entre na sua conta para continuar
                      </ThemedText>
                    </View>

                    <View className="gap-3">
                      <ControlledInput
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="off"
                      />

                      <ControlledInput
                        control={control}
                        name="password"
                        label="Senha"
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="off"
                      />

                      {loginError && (
                        <View className="flex-row items-center bg-red-50 py-3 px-4 mb-2 rounded-xl gap-2 border border-red-200">
                          <Ionicons
                            name="alert-circle"
                            size={18}
                            color="#DC2626"
                          />
                          <ThemedText className="flex-1 text-red-600 text-sm font-medium">
                            Falha no login. Verifique suas credenciais.
                          </ThemedText>
                        </View>
                      )}

                      <View className="flex-row justify-between items-center mt-1">
                        <View>
                          <ControlledCheckbox
                            label="Lembrar"
                            control={control}
                            name="rememberMe"
                            labelReverse
                            colorText="text-card-foreground"
                          />
                        </View>
                        <Pressable>
                          <Text className="text-sm text-primary font-semibold">
                            Esqueci a senha
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="px-6 pb-8 pt-4 md:pb-10 border-t border-t-gray-100">
                  <Button
                    title={isLoading ? "ENTRANDO..." : "ENTRAR"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    size="md"
                    className="w-full mb-4"
                  />

                  <View className="flex-row justify-center items-center">
                    <ThemedText className="text-sm text-gray-500">
                      Não tem uma conta?{" "}
                    </ThemedText>
                    <Link href="/register" asChild>
                      <Pressable>
                        <ThemedText className="text-sm text-primary font-bold">
                          Cadastre-se
                        </ThemedText>
                      </Pressable>
                    </Link>
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
