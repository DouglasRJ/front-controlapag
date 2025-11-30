import React from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card, CardContent } from "@/components/ui/card";
import { ChargeStatusBadge } from "@/components/charges/charge-status-badge";
import { Charge } from "@/types/charge";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { Ionicons } from "@expo/vector-icons";

type DisputeCardProps = {
  dispute: Charge;
  onPress: (disputeId: string) => void;
};

export function DisputeCard({ dispute, onPress }: DisputeCardProps) {
  return (
    <Card key={dispute.id} className="border-warning-200 dark:border-warning-500/30">
      <CardContent className="pt-6">
        <Pressable onPress={() => onPress(dispute.id)}>
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <ThemedText className="text-xl font-bold">
                  {formatCurrency(dispute.amount)}
                </ThemedText>
                <ChargeStatusBadge status={dispute.status} />
              </View>
              <View className="gap-1">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    className="text-foreground/60"
                  />
                  <ThemedText className="text-sm text-foreground/60">
                    Vencimento: {formatDate(dispute.dueDate)}
                  </ThemedText>
                </View>
                {dispute.paidAt && (
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      className="text-success-500"
                    />
                    <ThemedText className="text-sm text-foreground/60">
                      Pago em: {formatDate(dispute.paidAt)}
                    </ThemedText>
                  </View>
                )}
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    className="text-warning-500"
                  />
                  <ThemedText className="text-sm text-warning-600 dark:text-warning-400">
                    Disputa iniciada em: {formatDate(dispute.updatedAt)}
                  </ThemedText>
                </View>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              className="text-foreground/40"
            />
          </View>
        </Pressable>
      </CardContent>
    </Card>
  );
}

