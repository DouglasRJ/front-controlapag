import React from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChargeStatusBadge } from "@/components/charges/charge-status-badge";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { Ionicons } from "@expo/vector-icons";

type ChargeCardProps = {
  charge: Charge;
  onPress: (chargeId: string) => void;
  onRefund?: (charge: Charge) => void;
};

export function ChargeCard({ charge, onPress, onRefund }: ChargeCardProps) {
  const canRefund =
    charge.status === CHARGE_STATUS.PAID ||
    charge.status === CHARGE_STATUS.PARTIALLY_REFUNDED;

  return (
    <Card key={charge.id} className="border border-border">
      <CardContent className="pt-6">
        <Pressable onPress={() => onPress(charge.id)}>
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <ThemedText className="text-xl font-bold">
                  {formatCurrency(charge.amount)}
                </ThemedText>
                <ChargeStatusBadge status={charge.status} />
              </View>
              <View className="gap-1">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    className="text-foreground/60"
                  />
                  <ThemedText className="text-sm text-foreground/60">
                    Vencimento: {formatDate(charge.dueDate)}
                  </ThemedText>
                </View>
                {charge.paidAt && (
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      className="text-success-500"
                    />
                    <ThemedText className="text-sm text-foreground/60">
                      Pago em: {formatDate(charge.paidAt)}
                    </ThemedText>
                  </View>
                )}
                {charge.refundedAmount && charge.refundedAmount > 0 && (
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="arrow-back-circle-outline"
                      size={16}
                      className="text-warning-500"
                    />
                    <ThemedText className="text-sm text-foreground/60">
                      Reembolsado: {formatCurrency(charge.refundedAmount)}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              className="text-foreground/40"
            />
          </View>
        </Pressable>

        {canRefund && onRefund && (
          <View className="flex-row gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onPress={() => onRefund(charge)}
              className="flex-1"
            >
              <Ionicons name="arrow-back-outline" size={18} className="mr-2" />
              <ThemedText>Reembolsar</ThemedText>
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

