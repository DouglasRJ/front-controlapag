import { ThemedText } from "@/components/themed-text";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { formatCurrency } from "@/utils/format-currency";
import React from "react";
import { GestureResponderEvent, TouchableOpacity, View } from "react-native";

type ChargeItemProps = {
  charge: Charge;
  onPress: (event: GestureResponderEvent) => void;
};

const getStatusDetails = (status: CHARGE_STATUS) => {
  switch (status) {
    case CHARGE_STATUS.PAID:
      return { label: "Pago", color: "text-green-600" };
    case CHARGE_STATUS.PENDING:
      return { label: "Pendente", color: "text-orange-600" };
    case CHARGE_STATUS.OVERDUE:
      return { label: "Vencido", color: "text-red-600" };
    case CHARGE_STATUS.CANCELED:
      return { label: "Cancelado", color: "text-gray-500" };
    default:
      return { label: status, color: "text-foreground" };
  }
};

export function ChargeItem({ charge, onPress }: ChargeItemProps) {
  const statusDetails = getStatusDetails(charge.status);
  const dueDate = new Date(charge.dueDate);
  const formattedDueDate = dueDate.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
  const formattedPaidAt = charge.paidAt
    ? new Date(charge.paidAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "-";

  const isDisabled =
    charge.status !== CHARGE_STATUS.PENDING &&
    charge.status !== CHARGE_STATUS.OVERDUE;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className="w-full min-h-16  rounded-lg mb-2 border-l-4 border-l-primary border-2 border-slate-200 py-2.5 px-2.5 justify-between"
      activeOpacity={isDisabled ? 1 : 0.7}
    >
      <View className="gap-1 flex-1 mr-2">
        <ThemedText className="text-sm font-medium text-card-foreground">
          Vencimento: {formattedDueDate}
        </ThemedText>
        <ThemedText className={`text-sm font-bold ${statusDetails.color}`}>
          Status: {statusDetails.label}
        </ThemedText>
        {charge.paidAt && (
          <ThemedText className="text-xs text-card-foreground">
            Pago em: {formattedPaidAt}
          </ThemedText>
        )}
      </View>
      <View>
        <ThemedText className="text-base font-semibold text-card-foreground">
          {formatCurrency(charge.amount)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
