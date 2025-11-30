import React, { useEffect, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { ControlledInput } from "@/components/forms/controlled-input";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { showToast } from "@/store/toastStore";
import { Ionicons } from "@expo/vector-icons";

const acceptInviteSchema = z.object({
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  email: z.string().email("Email inválido").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

export default function AcceptInviteScreen() {
  const params = useLocalSearchParams();
  const token = (params.token as string) || "";
  const organizationId = (params.organizationId as string) || "";
  const { login, setUser } = useAuthStore();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !organizationId) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Try to decode token to get email (basic check)
        // The actual validation happens on the backend
        setIsValid(true);
        setIsVerifying(false);
      } catch (error) {
        setIsValid(false);
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, organizationId]);

  const onSubmit = async (data: AcceptInviteFormData) => {
    if (!token || !organizationId) {
      showToast("Link de convite inválido", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/accept-invite", {
        token,
        organizationId,
        username: data.username,
        password: data.password,
        email: data.email || inviteEmail,
      });

      if (response.data.accessToken) {
        const { user, accessToken } = response.data;
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        setUser(user);
        showToast("Convite aceito com sucesso!", "success");
        
        // Redirect to dashboard
        router.replace("/(tabs)/(provider)/services");
      }
    } catch (error: any) {
      console.error("Accept invite error:", error);
      const message =
        error?.response?.data?.message ||
        "Erro ao aceitar convite. Verifique se o link ainda é válido.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
        <ThemedText className="mt-4 text-foreground/60">
          Verificando convite...
        </ThemedText>
      </View>
    );
  }

  if (!isValid || !token || !organizationId) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <View className="items-center">
              <Ionicons
                name="alert-circle-outline"
                size={48}
                className="text-destructive mb-4"
              />
              <ThemedText className="text-lg font-semibold mb-2">
                Convite Inválido
              </ThemedText>
              <ThemedText className="text-center text-foreground/60 mb-4">
                Este link de convite é inválido ou expirou. Entre em contato com o administrador
                da organização para receber um novo convite.
              </ThemedText>
              <Button
                variant="outline"
                onPress={() => router.replace("/(auth)/login")}
                className="w-full"
              >
                <ThemedText>Ir para Login</ThemedText>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="max-w-md w-full mx-auto">
          <Card>
            <CardHeader>
              <View className="items-center mb-2">
                <View className="h-16 w-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <Ionicons name="mail-outline" size={32} className="text-primary" />
                </View>
                <CardTitle className="text-center">Aceitar Convite</CardTitle>
                <CardDescription className="text-center mt-2">
                  Complete seu cadastro para se juntar à organização como Sub-Provider
                </CardDescription>
              </View>
            </CardHeader>
            <CardContent>
              <View className="space-y-4">
                <View>
                  <ThemedText className="text-sm font-medium mb-2">Username</ThemedText>
                  <ControlledInput
                    control={control}
                    name="username"
                    placeholder="Escolha um username"
                    autoCapitalize="none"
                  />
                  {errors.username && (
                    <ThemedText className="text-sm text-destructive mt-1">
                      {errors.username.message}
                    </ThemedText>
                  )}
                </View>

                {inviteEmail && (
                  <View>
                    <ThemedText className="text-sm font-medium mb-2">Email</ThemedText>
                    <ThemedText className="text-sm text-foreground/60 p-3 rounded-lg bg-muted">
                      {inviteEmail}
                    </ThemedText>
                    <ThemedText className="text-xs text-foreground/60 mt-1">
                      Este email foi fornecido no convite
                    </ThemedText>
                  </View>
                )}

                {!inviteEmail && (
                  <View>
                    <ThemedText className="text-sm font-medium mb-2">Email (opcional)</ThemedText>
                    <ControlledInput
                      control={control}
                      name="email"
                      placeholder="seu@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <ThemedText className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </ThemedText>
                    )}
                  </View>
                )}

                <View>
                  <ThemedText className="text-sm font-medium mb-2">Senha</ThemedText>
                  <ControlledInput
                    control={control}
                    name="password"
                    placeholder="Crie uma senha"
                    secureTextEntry
                  />
                  {errors.password && (
                    <ThemedText className="text-sm text-destructive mt-1">
                      {errors.password.message}
                    </ThemedText>
                  )}
                </View>

                <View>
                  <ThemedText className="text-sm font-medium mb-2">Confirmar Senha</ThemedText>
                  <ControlledInput
                    control={control}
                    name="confirmPassword"
                    placeholder="Confirme sua senha"
                    secureTextEntry
                  />
                  {errors.confirmPassword && (
                    <ThemedText className="text-sm text-destructive mt-1">
                      {errors.confirmPassword.message}
                    </ThemedText>
                  )}
                </View>

                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="w-full mt-4"
                >
                  {isSubmitting ? (
                    <ThemedText>Aceitando convite...</ThemedText>
                  ) : (
                    <ThemedText>Aceitar Convite</ThemedText>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onPress={() => router.replace("/(auth)/login")}
                  className="w-full"
                >
                  <ThemedText>Cancelar</ThemedText>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
