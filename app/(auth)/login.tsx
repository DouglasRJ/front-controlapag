import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import { LoginData, loginSchema } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuthStore();
  const cardBackgroundColor = useThemeColor({}, "card");
  const bgColor = useThemeColor({}, "background");
  const linkColor = useThemeColor({}, "tint");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginData>({
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
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <View style={styles.header}>
          <Logo fontSize={36} />
          <ThemedText style={styles.subtitle}>
            Entre na sua conta para gerenciar seus serviços
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <ControlledInput
            control={control}
            name="email"
            label="Email"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ControlledInput
            control={control}
            name="password"
            label="Senha"
            placeholder="********"
            secureTextEntry
          />

          <View style={styles.optionsRow}>
            <ControlledCheckbox
              control={control}
              name="rememberMe"
              label="Lembrar de mim"
            />
            <Link href="/forgot-password" asChild>
              <Pressable>
                <ThemedText style={[styles.linkText, { color: bgColor }]}>
                  Esqueci a senha
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title={isSubmitting ? "Entrando..." : "ENTRAR"}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            size="md"
          />

          <View style={styles.footer}>
            <ThemedText style={[styles.linkText, { color: bgColor }]}>
              Ainda não tem uma conta?{" "}
            </ThemedText>
            <Link href="/register" asChild>
              <Pressable>
                <ThemedText style={[styles.linkText, { color: linkColor }]}>
                  Cadastre-se
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    height: "70%",
    width: "100%",
    maxWidth: 520,
    borderRadius: 16,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 25,
    gap: 10,
  },
  header: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: FontPoppins.MEDIUM,
  },
  formContainer: {
    gap: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkText: {
    fontSize: 12,
    fontFamily: FontPoppins.MEDIUM,
  },
  actionsContainer: {
    gap: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
