import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

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

export default function StripeReturnScreen() {
  const { fetchProfile, user } = useAuthStore();
  const [profileFetched, setProfileFetched] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setProfileFetched(false);
      setFetchError(false);
      setIsNavigating(false);

      const handleReturn = async () => {
        console.log("StripeReturnScreen: Focado. Chamando fetchProfile...");
        try {
          await fetchProfile();
          console.log("StripeReturnScreen: fetchProfile concluído.");
          if (isActive) {
            setProfileFetched(true);
          }
        } catch (error: any) {
          console.error("StripeReturnScreen: Erro no fetchProfile:", error);
          if (isActive) {
            setFetchError(true);
            setProfileFetched(true);
          }
        }
      };
      handleReturn();
      return () => {
        isActive = false;
      };
    }, [fetchProfile])
  );

  const handleProceed = () => {
    setIsNavigating(true);
    router.replace("/services");
  };

  if (!profileFetched) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 10 }}>
          Verificando configuração...
        </ThemedText>
      </ThemedView>
    );
  }

  if (fetchError) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Ionicons name="warning-outline" size={60} className="text-red-500" />
        <ThemedText className="text-xl font-bold text-center mt-4 text-foreground">
          Ocorreu um Erro
        </ThemedText>
        <ThemedText className="text-base text-center mt-2 text-muted-foreground mb-6">
          Não foi possível verificar o status da sua conta. Por favor, tente
          acessar novamente.
        </ThemedText>
        <Button title="Ir para o Início" onPress={() => router.replace("/")} />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 60 }}>
        <View className="px-6 items-center">
          <View className="items-center mb-10">
            <View className="flex h-20 w-20 items-center justify-center rounded-full bg-primary mb-5">
              <Ionicons
                name="checkmark-done-circle"
                size={52}
                className="text-dark"
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
            <InfoIconWrapper icon="cash" iconClassName="text-light" />
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
                Pagamentos de clientes (cartão, boleto) entram primeiro no seu
                saldo seguro do Stripe.
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
                O Stripe envia o dinheiro automaticamente para sua conta
                bancária. Isso geralmente leva alguns dias úteis no Brasil após
                o saldo ficar disponível.
              </ThemedText>
              <ThemedText className="text-sm text-muted-foreground mt-2">
                Acompanhe seu saldo e transferências no dashboard do Stripe.
              </ThemedText>
            </View>
          </InfoCard>

          {/* Card: Verificação da Conta */}
          <InfoCard>
            <InfoIconWrapper
              icon="shield-checkmark"
              iconClassName="text-light"
            />
            <ThemedText className="text-xl font-semibold text-primary mb-3">
              Verificação de Conta
            </ThemedText>
            <View className="space-y-3">
              <ThemedText className="text-card-foreground leading-relaxed">
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  className="mr-2 text-primary"
                />
                O Stripe pode precisar de um tempo (geralmente horas ou poucos
                dias) para verificar completamente sua conta após o cadastro.
              </ThemedText>
              <ThemedText className="text-card-foreground leading-relaxed">
                <Ionicons
                  name="mail-outline"
                  size={18}
                  className="mr-2 text-primary"
                />
                Você será notificado por e-mail ou no dashboard do Stripe se
                precisarem de documentos ou informações adicionais.
              </ThemedText>
              <ThemedText className="text-sm text-muted-foreground mt-2">
                Manter sua conta verificada é essencial para garantir
                transferências tranquilas.
              </ThemedText>
            </View>
          </InfoCard>

          {/* Card: Próximos Passos */}
          <InfoCard>
            <InfoIconWrapper icon="rocket" iconClassName=" text-light" />
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
                Sua conta está configurada! Agora você pode criar serviços e
                contratos na nossa plataforma.
              </ThemedText>
              <ThemedText className="text-card-foreground leading-relaxed">
                <Ionicons
                  name="timer-outline"
                  size={18}
                  className="mr-2 text-primary"
                />
                <ThemedText className="font-semibold text-card-foreground">
                  {" "}
                  Primeiros Pagamentos:
                </ThemedText>{" "}
                As primeiras transferências para sua conta bancária podem levar
                um pouco mais de tempo (até 7-14 dias) como medida de segurança
                padrão do Stripe.
              </ThemedText>
            </View>
          </InfoCard>

          <Button
            title={isNavigating ? "Carregando" : "Acessar a plataforma"}
            onPress={handleProceed}
            disabled={isNavigating}
            className="w-full mt-4"
            size="lg"
          >
            {isNavigating && <ActivityIndicator className="text-primary" />}
          </Button>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
