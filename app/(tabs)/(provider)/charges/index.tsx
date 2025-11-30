import React, { useState } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChargeStatusBadge } from "@/components/charges/charge-status-badge";
import { ChargeCard } from "@/components/charges/charge-card";
import { useAllCharges } from "@/hooks/use-all-charges";
import { useCharge } from "@/hooks/use-charges";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { Ionicons } from "@expo/vector-icons";
import { RefundModal } from "@/components/charges/refund-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RefundTimeline } from "@/components/charges/refund-timeline";
import { ErrorState } from "@/components/ui/error-state";
import { SkeletonCard } from "@/components/ui/skeleton";

type FilterStatus = "all" | CHARGE_STATUS;

export default function ChargesScreen() {
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  
  const { data: charges, isLoading, error, refetch } = useAllCharges(
    filterStatus !== "all" ? { status: filterStatus as CHARGE_STATUS } : undefined
  );
  const { data: selectedCharge } = useCharge(selectedChargeId || undefined);

  const canRefund = (charge: Charge) => {
    return (
      charge.status === CHARGE_STATUS.PAID ||
      charge.status === CHARGE_STATUS.PARTIALLY_REFUNDED
    );
  };

  const handleChargePress = (chargeId: string) => {
    setSelectedChargeId(chargeId);
  };

  const handleRefund = (charge: Charge) => {
    setSelectedChargeId(charge.id);
    setRefundModalOpen(true);
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
          title="Erro ao carregar cobranças"
          message="Não foi possível carregar a lista de cobranças."
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
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <ThemedText className="text-3xl font-bold">Cobranças</ThemedText>
              <ThemedText className="text-foreground/60 mt-1">
                Gerencie todas as suas cobranças
              </ThemedText>
            </View>
          </View>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <View className="flex-row gap-2 flex-wrap">
                {(["all", CHARGE_STATUS.PENDING, CHARGE_STATUS.PAID, CHARGE_STATUS.OVERDUE, CHARGE_STATUS.IN_DISPUTE, CHARGE_STATUS.REFUNDED] as FilterStatus[]).map((status) => (
                  <Pressable
                    key={status}
                    onPress={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg ${
                      filterStatus === status
                        ? "bg-primary"
                        : "bg-muted border border-border"
                    }`}
                  >
                    <ThemedText
                      className={`text-sm font-medium ${
                        filterStatus === status
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {status === "all"
                        ? "Todas"
                        : status === CHARGE_STATUS.PENDING
                        ? "Pendentes"
                        : status === CHARGE_STATUS.PAID
                        ? "Pagas"
                        : status === CHARGE_STATUS.OVERDUE
                        ? "Vencidas"
                        : status === CHARGE_STATUS.IN_DISPUTE
                        ? "Em Disputa"
                        : "Reembolsadas"}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* Charges List */}
          {!charges || charges.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <View className="items-center justify-center">
                  <Ionicons
                    name="receipt-outline"
                    size={64}
                    className="text-foreground/30 mb-4"
                  />
                  <ThemedText className="text-lg font-semibold mb-2">
                    Nenhuma cobrança encontrada
                  </ThemedText>
                  <ThemedText className="text-sm text-foreground/60 text-center">
                    {filterStatus !== "all"
                      ? "Não há cobranças com este status."
                      : "Você ainda não possui cobranças."}
                  </ThemedText>
                </View>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-4">
              {charges.map((charge) => (
                <ChargeCard
                  key={charge.id}
                  charge={charge}
                  onPress={handleChargePress}
                  onRefund={canRefund(charge) ? handleRefund : undefined}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Charge Detail Modal */}
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
                  Detalhes da Cobrança
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

                  {/* Refund Timeline */}
                  {(selectedCharge.refundedAmount || 0) > 0 && (
                    <RefundTimeline charge={selectedCharge} />
                  )}

                  {/* Actions */}
                  {canRefund(selectedCharge) && (
                    <Button
                      onPress={() => {
                        setRefundModalOpen(true);
                      }}
                      className="w-full"
                    >
                      <Ionicons name="arrow-back-outline" size={18} className="mr-2" />
                      <ThemedText>Processar Reembolso</ThemedText>
                    </Button>
                  )}
                </View>
              </View>
            </ScrollView>
          </DialogContent>
        </Dialog>
      )}

      {/* Refund Modal */}
      {selectedCharge && (
        <RefundModal
          charge={selectedCharge}
          open={refundModalOpen}
          onOpenChange={setRefundModalOpen}
          onSuccess={() => {
            setRefundModalOpen(false);
            refetch();
          }}
        />
      )}
    </View>
  );
}
