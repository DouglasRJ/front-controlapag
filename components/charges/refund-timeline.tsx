import React from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Charge } from "@/types/charge";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RefundTimelineProps {
  charge: Charge;
}

export function RefundTimeline({ charge }: RefundTimelineProps) {
  const refundedAmount = charge.refundedAmount || 0;
  const chargeAmount = charge.amount;

  if (refundedAmount === 0) {
    return null;
  }

  const isFullyRefunded = refundedAmount >= chargeAmount;
  const refundPercentage = (refundedAmount / chargeAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ThemedText className="text-lg font-semibold">Histórico de Reembolsos</ThemedText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <View className="gap-4">
          {/* Refund Summary */}
          <View className="p-4 rounded-lg bg-muted/30 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name={isFullyRefunded ? "checkmark-circle" : "time-outline"}
                  size={20}
                  className={isFullyRefunded ? "text-success-500" : "text-warning-500"}
                />
                <ThemedText className="text-sm font-medium">
                  {isFullyRefunded ? "Reembolso Completo" : "Reembolso Parcial"}
                </ThemedText>
              </View>
              <ThemedText className="text-lg font-bold text-primary">
                {formatCurrency(refundedAmount)}
              </ThemedText>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(refundPercentage, 100)}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <ThemedText className="text-xs text-foreground/60">
                {refundPercentage.toFixed(1)}% do valor total
              </ThemedText>
              <ThemedText className="text-xs text-foreground/60">
                Restante: {formatCurrency(chargeAmount - refundedAmount)}
              </ThemedText>
            </View>
          </View>

          {/* Refund Details */}
          <View className="gap-2">
            <ThemedText className="text-sm font-medium mb-2">Detalhes</ThemedText>
            <View className="flex-row items-center justify-between p-3 rounded-lg bg-card border border-border">
              <View className="flex-row items-center gap-2">
                <Ionicons name="cash-outline" size={16} className="text-foreground/60" />
                <ThemedText className="text-sm">Valor Reembolsado</ThemedText>
              </View>
              <ThemedText className="text-sm font-semibold">
                {formatCurrency(refundedAmount)}
              </ThemedText>
            </View>
            <View className="flex-row items-center justify-between p-3 rounded-lg bg-card border border-border">
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} className="text-foreground/60" />
                <ThemedText className="text-sm">Data do Reembolso</ThemedText>
              </View>
              <ThemedText className="text-sm">
                {charge.updatedAt ? formatDate(new Date(charge.updatedAt)) : "N/A"}
              </ThemedText>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

