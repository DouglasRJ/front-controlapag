import React, { useState } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargeStatusBadge } from "@/components/charges/charge-status-badge";
import { DisputeCard } from "@/components/disputes/dispute-card";
import { useDisputes } from "@/hooks/use-disputes";
import { useCharge } from "@/hooks/use-charges";
import { Charge } from "@/types/charge";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { Ionicons } from "@expo/vector-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ErrorState } from "@/components/ui/error-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { RefundTimeline } from "@/components/charges/refund-timeline";

export default function DisputesScreen() {
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  
  const { data: disputes, isLoading, error, refetch } = useDisputes();
  const { data: selectedCharge } = useCharge(selectedChargeId || undefined);

  const handleDisputePress = (chargeId: string) => {
    setSelectedChargeId(chargeId);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <View className="gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} showHeader={true} lines={3} />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background">
        <ErrorState
          title="Erro ao carregar disputas"
          message="Não foi possível carregar a lista de disputas."
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        <View className="max-w-6xl mx-auto w-full gap-6">
          {/* Header */}
          <View className="mb-4">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="h-12 w-12 rounded-full bg-warning-100 dark:bg-warning-500/20 items-center justify-center">
                <Ionicons name="warning" size={24} className="text-warning-600 dark:text-warning-500" />
              </View>
              <View className="flex-1">
                <ThemedText className="text-3xl font-bold">Disputas</ThemedText>
                <ThemedText className="text-foreground/60 mt-1">
                  Cobranças em disputa que requerem atenção
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Info Card */}
          <Card className="bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-500/30">
            <CardContent className="pt-6">
              <View className="flex-row items-start gap-3">
                <Ionicons name="information-circle-outline" size={24} className="text-warning-600 dark:text-warning-500" />
                <View className="flex-1">
                  <ThemedText className="text-sm font-medium text-warning-800 dark:text-warning-200 mb-1">
                    O que são disputas?
                  </ThemedText>
                  <ThemedText className="text-xs text-warning-700 dark:text-warning-300">
                    Disputas ocorrem quando um cliente contesta uma cobrança. Você pode revisar os detalhes e tomar as ações necessárias.
                  </ThemedText>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Disputes List */}
          {!disputes || disputes.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <View className="items-center justify-center">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={64}
                    className="text-success-500 mb-4"
                  />
                  <ThemedText className="text-lg font-semibold mb-2">
                    Nenhuma disputa encontrada
                  </ThemedText>
                  <ThemedText className="text-sm text-foreground/60 text-center">
                    Ótimo! Você não possui disputas pendentes no momento.
                  </ThemedText>
                </View>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-4">
              {disputes.map((dispute) => (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  onPress={handleDisputePress}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Dispute Detail Modal */}
      {selectedCharge && (
        <Dialog
          open={!!selectedChargeId}
          onOpenChange={(open) => {
            if (!open) setSelectedChargeId(null);
          }}
        >
          <DialogContent className="max-h-[90%]">
            <DialogHeader>
              <DialogTitle>
                <ThemedText className="text-xl font-bold">
                  Detalhes da Disputa
                </ThemedText>
              </DialogTitle>
              <DialogDescription>
                <ThemedText className="text-sm text-foreground/60">
                  ID: {selectedCharge.id}
                </ThemedText>
              </DialogDescription>
            </DialogHeader>

            <ScrollView className="max-h-[70vh]">
              <View className="gap-6 mt-4">
                {/* Warning Alert */}
                <Card className="bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-500/30">
                  <CardContent className="pt-6">
                    <View className="flex-row items-start gap-3">
                      <Ionicons name="warning" size={24} className="text-warning-600 dark:text-warning-500" />
                      <View className="flex-1">
                        <ThemedText className="text-sm font-medium text-warning-800 dark:text-warning-200 mb-1">
                          Esta cobrança está em disputa
                        </ThemedText>
                        <ThemedText className="text-xs text-warning-700 dark:text-warning-300">
                          O cliente contestou esta cobrança. Revise os detalhes e entre em contato se necessário.
                        </ThemedText>
                      </View>
                    </View>
                  </CardContent>
                </Card>

                {/* Charge Info */}
                <View className="gap-4">
                  <View className="p-4 rounded-lg bg-muted/30 border border-border">
                    <View className="flex-row items-center justify-between mb-3">
                      <ThemedText className="text-sm text-foreground/60">Valor</ThemedText>
                      <ThemedText className="text-2xl font-bold">
                        {formatCurrency(selectedCharge.amount)}
                      </ThemedText>
                    </View>
                    <View className="flex-row items-center justify-between mb-3">
                      <ThemedText className="text-sm text-foreground/60">Status</ThemedText>
                      <ChargeStatusBadge status={selectedCharge.status} />
                    </View>
                    <View className="flex-row items-center justify-between mb-3">
                      <ThemedText className="text-sm text-foreground/60">Vencimento</ThemedText>
                      <ThemedText className="text-sm">
                        {formatDate(selectedCharge.dueDate)}
                      </ThemedText>
                    </View>
                    {selectedCharge.paidAt && (
                      <View className="flex-row items-center justify-between">
                        <ThemedText className="text-sm text-foreground/60">Pago em</ThemedText>
                        <ThemedText className="text-sm">
                          {formatDate(selectedCharge.paidAt)}
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  {/* Refund Timeline (if applicable) */}
                  {(selectedCharge.refundedAmount || 0) > 0 && (
                    <RefundTimeline charge={selectedCharge} />
                  )}

                  {/* Actions */}
                  <View className="gap-2">
                    <ThemedText className="text-sm font-medium mb-2">Ações Disponíveis</ThemedText>
                    <View className="p-4 rounded-lg bg-muted/30 border border-border">
                      <ThemedText className="text-sm text-foreground/60 mb-2">
                        Para resolver esta disputa, você pode:
                      </ThemedText>
                      <View className="gap-2">
                        <View className="flex-row items-start gap-2">
                          <Ionicons name="checkmark-circle-outline" size={16} className="text-success-500 mt-0.5" />
                          <ThemedText className="text-sm flex-1">
                            Entrar em contato com o cliente para esclarecer a situação
                          </ThemedText>
                        </View>
                        <View className="flex-row items-start gap-2">
                          <Ionicons name="checkmark-circle-outline" size={16} className="text-success-500 mt-0.5" />
                          <ThemedText className="text-sm flex-1">
                            Processar um reembolso se necessário
                          </ThemedText>
                        </View>
                        <View className="flex-row items-start gap-2">
                          <Ionicons name="checkmark-circle-outline" size={16} className="text-success-500 mt-0.5" />
                          <ThemedText className="text-sm flex-1">
                            Fornecer documentação adicional se solicitado
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </DialogContent>
        </Dialog>
      )}
    </View>
  );
}
