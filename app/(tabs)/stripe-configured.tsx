import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  ScrollView,
  View,
} from "react-native";

const InfoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <View className={`w-full rounded-xl bg-card shadow-md p-6 mb-6 ${className}`}>
    {children}
  </View>
);

const InfoIconWrapper: React.FC<{
  icon: React.ComponentProps<typeof Ionicons>["name"];
  className?: string;
  iconClassName: string;
}> = ({ icon, className, iconClassName = "" }) => (
  <View
    className={`flex h-14 w-14 items-center justify-center rounded-lg bg-primary mb-4 ${className}`}
  >
    <Ionicons name={icon} size={30} className={iconClassName} />
  </View>
);

const POLLING_INTERVAL = 5000;
const MAX_ATTEMPTS = 12;
const RETRY_DELAY_ON_429 = 10000;

type ScreenStatus = "checking" | "active" | "error" | "timeout";

export default function StripeReturnScreen() {
  const { fetchProfile, user, logout } = useAuthStore();
  const [status, setStatus] = useState<ScreenStatus>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const attemptCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingActive = useRef(false);

  const checkStatusCallbackRef = useRef<
    ((isRetry?: boolean) => Promise<void>) | null
  >(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    checkStatusCallbackRef.current = async (isRetry = false) => {
      if (!isPollingActive.current) {
        return;
      }

      if (!isRetry && attemptCountRef.current < MAX_ATTEMPTS) {
        attemptCountRef.current += 1;
      }

      setStatus((prevStatus) =>
        prevStatus === "active" ||
        prevStatus === "error" ||
        prevStatus === "timeout"
          ? prevStatus
          : "checking"
      );

      clearTimer();

      try {
        await fetchProfile();
        const updatedUser = useAuthStore.getState().user;
        const currentApiStatus = updatedUser?.providerProfile?.status;

        if (!isPollingActive.current) return;

        if (currentApiStatus === "ACTIVE") {
          setStatus("active");
          isPollingActive.current = false;
          return;
        }

        if (attemptCountRef.current >= MAX_ATTEMPTS) {
          setErrorMessage(
            "A verificação da conta ainda está em andamento. Tente novamente mais tarde."
          );
          setStatus("timeout");
          isPollingActive.current = false;
          return;
        }

        if (isPollingActive.current) {
          timeoutRef.current = setTimeout(
            () => checkStatusCallbackRef.current!(false),
            POLLING_INTERVAL
          );
        }
      } catch (err: any) {
        if (!isPollingActive.current) return;

        const errStatus = err?.response?.status;

        if (errStatus === 401 || errStatus === 403) {
          isPollingActive.current = false;
          logout();
        } else if (errStatus === 429) {
          if (isPollingActive.current) {
            clearTimer();
            timeoutRef.current = setTimeout(
              () => checkStatusCallbackRef.current!(true),
              RETRY_DELAY_ON_429
            );
          }
        } else {
          setErrorMessage(
            "Erro ao verificar status. Verifique sua conexão ou tente novamente."
          );
          setStatus("error");
          isPollingActive.current = false;
        }
      }
    };
  });

  useEffect(() => {
    let isMounted = true;
    const appStateRef = { current: AppState.currentState };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const isActive = nextAppState === "active";
      const wasActive = appStateRef.current.match(/active/);
      appStateRef.current = nextAppState;

      if (isActive && !wasActive && isMounted) {
        isPollingActive.current = true;
        attemptCountRef.current = 0;
        setStatus("checking");
        setErrorMessage(null);
        clearTimer();
        checkStatusCallbackRef.current!();
      } else if (!isActive && wasActive) {
        isPollingActive.current = false;
        clearTimer();
      }
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    if (appStateRef.current === "active") {
      isPollingActive.current = true;
      attemptCountRef.current = 0;
      setStatus("checking");
      setErrorMessage(null);
      clearTimer();
      checkStatusCallbackRef.current!();
    } else {
      isPollingActive.current = false;
    }

    return () => {
      isMounted = false;
      isPollingActive.current = false;
      appStateSubscription.remove();
      clearTimer();
    };
  }, [clearTimer]);

  const handleRetry = () => {
    setErrorMessage(null);
    attemptCountRef.current = 0;
    isPollingActive.current = true;
    checkStatusCallbackRef.current!();
  };

  if (status === "checking") {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color={"#F57418"} />
        <ThemedText
          style={{ marginTop: 15, fontSize: 16, textAlign: "center" }}
        >
          {attemptCountRef.current <= 1
            ? "Verificando configuração da conta Stripe..."
            : `Aguardando ativação... (Tentativa ${attemptCountRef.current}/${MAX_ATTEMPTS})`}
        </ThemedText>
        <ThemedText
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "gray",
            textAlign: "center",
          }}
        >
          Isso pode levar alguns instantes.
        </ThemedText>
      </ThemedView>
    );
  }

  if (status === "error" || status === "timeout") {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Ionicons
          name="warning-outline"
          size={60}
          className="text-destructive"
        />
        <ThemedText className="text-xl font-bold text-center mt-4 text-foreground">
          {status === "timeout"
            ? "Verificação Pendente"
            : "Erro na Verificação"}
        </ThemedText>
        <ThemedText className="text-base text-center mt-2 text-muted-foreground mb-6">
          {errorMessage || "Ocorreu um problema."}
        </ThemedText>
        <Button
          title="Tentar Novamente"
          onPress={handleRetry}
          className="mb-4 w-full"
        />
        <Button
          title="Voltar ao Início"
          onPress={() => router.replace("/")}
          variant="outline"
          className="w-full"
        />
      </ThemedView>
    );
  }

  if (status === "active") {
    return (
      <ThemedView className="flex-1 bg-background">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 60 }}
        >
          <View className="px-6 items-center">
            <View className="items-center mb-10">
              <View className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mb-5">
                <Ionicons
                  name="checkmark-done-circle"
                  size={52}
                  className="text-primary-foreground"
                />
              </View>
              <ThemedText className="text-3xl font-bold text-center text-foreground mb-2 text-balance">
                Tudo Pronto! {user?.username} 🎉
              </ThemedText>
              <ThemedText className="text-lg text-center text-foreground text-balance">
                Sua conta de pagamentos foi configurada com sucesso via Stripe.
              </ThemedText>
            </View>
            <InfoCard>
              <InfoIconWrapper
                icon="cash"
                iconClassName="text-primary-foreground"
              />
              <ThemedText className="text-xl font-semibold text-primary mb-3">
                Recebendo Seus Pagamentos
              </ThemedText>
              <View className="space-y-3">
                <ThemedText className="text-card-foreground leading-relaxed">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    className="mr-2 text-primary"
                  />
                  <ThemedText className="font-semibold text-card-foreground">
                    {" "}
                    Saldo Stripe:
                  </ThemedText>{" "}
                  Pagamentos de clientes entram primeiro no seu saldo seguro do
                  Stripe.
                </ThemedText>
                <ThemedText className="text-card-foreground leading-relaxed">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    className="mr-2 text-primary"
                  />
                  <ThemedText className="font-semibold text-card-foreground">
                    {" "}
                    Transferências (Payouts):
                  </ThemedText>{" "}
                  O Stripe envia o dinheiro para sua conta bancária (pode levar
                  alguns dias úteis).
                </ThemedText>
                <ThemedText className="text-sm text-muted-foreground mt-2">
                  Acompanhe seu saldo e transferências no dashboard do Stripe.
                </ThemedText>
              </View>
            </InfoCard>
            <InfoCard>
              <InfoIconWrapper
                icon="shield-checkmark"
                iconClassName="text-primary-foreground"
              />
              <ThemedText className="text-xl font-semibold text-primary mb-3">
                Conta Verificada e Ativa
              </ThemedText>
              <View className="space-y-3">
                <ThemedText className="text-card-foreground leading-relaxed">
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    className="mr-2 text-primary"
                  />
                  Sua conta está pronta para receber pagamentos e
                  transferências.
                </ThemedText>
                <ThemedText className="text-card-foreground leading-relaxed">
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    className="mr-2 text-primary"
                  />
                  Fique atento ao seu e-mail caso o Stripe precise de
                  informações adicionais no futuro.
                </ThemedText>
              </View>
            </InfoCard>
            <InfoCard>
              <InfoIconWrapper
                icon="rocket"
                iconClassName=" text-primary-foreground"
              />
              <ThemedText className="text-xl font-semibold text-primary mb-3">
                Próximos Passos
              </ThemedText>
              <View className="space-y-3">
                <ThemedText className="text-card-foreground leading-relaxed">
                  <Ionicons
                    name="checkmark"
                    size={18}
                    className="mr-2 text-primary"
                  />
                  <ThemedText className="font-semibold text-card-foreground">
                    {" "}
                    Pronto para Começar:
                  </ThemedText>{" "}
                  Sua conta está configurada! Explore a plataforma.
                </ThemedText>
              </View>
            </InfoCard>
            <Button
              title="Acessar a plataforma"
              onPress={() => router.replace("/services")}
              className="w-full mt-4"
              size="lg"
            />
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return null;
}
