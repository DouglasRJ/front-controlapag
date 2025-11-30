import { CHARGE_STATUS } from "@/types/charge-status";
import { cn } from "@/utils/cn";
import React from "react";
import { Text, View } from "react-native";

const statusLabels: Record<CHARGE_STATUS, string> = {
  [CHARGE_STATUS.PAID]: "Pago",
  [CHARGE_STATUS.PENDING]: "Pendente",
  [CHARGE_STATUS.OVERDUE]: "Vencido",
  [CHARGE_STATUS.CANCELED]: "Cancelado",
  [CHARGE_STATUS.REFUNDED]: "Reembolsado",
  [CHARGE_STATUS.PARTIALLY_REFUNDED]: "Parcialmente Reembolsado",
  [CHARGE_STATUS.IN_DISPUTE]: "Em Disputa",
};

interface ChargeStatusBadgeProps {
  status: CHARGE_STATUS;
  className?: string;
}

export function ChargeStatusBadge({ status, className }: ChargeStatusBadgeProps) {
  const variants: Record<CHARGE_STATUS, string> = {
    [CHARGE_STATUS.PAID]: "bg-success-50 text-success-600 border-success-200 dark:bg-success-500/10 dark:text-success-500 dark:border-success-500/20",
    [CHARGE_STATUS.PENDING]: "bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning-500/10 dark:text-warning-500 dark:border-warning-500/20",
    [CHARGE_STATUS.OVERDUE]: "bg-error-50 text-error-600 border-error-200 dark:bg-error-500/10 dark:text-error-500 dark:border-error-500/20",
    [CHARGE_STATUS.REFUNDED]: "bg-neutral-50 text-neutral-600 border-neutral-200 dark:bg-neutral-500/10 dark:text-neutral-500 dark:border-neutral-500/20",
    [CHARGE_STATUS.PARTIALLY_REFUNDED]: "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-500/20 dark:text-neutral-400 dark:border-neutral-500/30",
    [CHARGE_STATUS.CANCELED]: "bg-neutral-50 text-neutral-600 border-neutral-200 dark:bg-neutral-500/10 dark:text-neutral-500 dark:border-neutral-500/20",
    [CHARGE_STATUS.IN_DISPUTE]: "bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-500/20 dark:text-warning-500 dark:border-warning-500/30",
  };

  return (
    <View
      className={cn(
        "px-2 py-1 rounded-full border",
        variants[status],
        className
      )}
    >
      <Text className="text-xs font-medium">{statusLabels[status]}</Text>
    </View>
  );
}

