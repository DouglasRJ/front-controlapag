import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemedText } from "@/components/themed-text";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type TransactionListProps = {
  charges?: Charge[];
  isLoading?: boolean;
  limit?: number;
};

const getStatusColor = (status: CHARGE_STATUS) => {
  switch (status) {
    case CHARGE_STATUS.PAID:
      return "text-green-600 dark:text-green-500";
    case CHARGE_STATUS.PENDING:
      return "text-yellow-600 dark:text-yellow-500";
    case CHARGE_STATUS.OVERDUE:
      return "text-red-600 dark:text-red-500";
    case CHARGE_STATUS.REFUNDED:
      return "text-gray-600 dark:text-gray-400";
    case CHARGE_STATUS.IN_DISPUTE:
      return "text-orange-600 dark:text-orange-500";
    default:
      return "text-foreground/60";
  }
};

const getStatusIcon = (status: CHARGE_STATUS) => {
  switch (status) {
    case CHARGE_STATUS.PAID:
      return "checkmark-circle";
    case CHARGE_STATUS.PENDING:
      return "time-outline";
    case CHARGE_STATUS.OVERDUE:
      return "alert-circle";
    case CHARGE_STATUS.REFUNDED:
      return "arrow-back-circle";
    case CHARGE_STATUS.IN_DISPUTE:
      return "warning";
    default:
      return "help-circle";
  }
};

const getStatusLabel = (status: CHARGE_STATUS) => {
  switch (status) {
    case CHARGE_STATUS.PAID:
      return "Pago";
    case CHARGE_STATUS.PENDING:
      return "Pendente";
    case CHARGE_STATUS.OVERDUE:
      return "Vencido";
    case CHARGE_STATUS.REFUNDED:
      return "Reembolsado";
    case CHARGE_STATUS.IN_DISPUTE:
      return "Em Disputa";
    default:
      return status;
  }
};

export function TransactionList({
  charges = [],
  isLoading = false,
  limit = 10,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <ThemedText className="text-xl font-semibold">Transações Recentes</ThemedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" />
          </View>
        </CardContent>
      </Card>
    );
  }

  const displayCharges = charges.slice(0, limit);

  if (displayCharges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <ThemedText className="text-xl font-semibold">Transações Recentes</ThemedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View className="items-center justify-center py-8">
            <Ionicons
              name="receipt-outline"
              size={48}
              className="text-foreground/30 mb-2"
            />
            <ThemedText className="text-sm text-foreground/60">
              Nenhuma transação encontrada
            </ThemedText>
          </View>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <ThemedText className="text-xl font-semibold">Transações Recentes</ThemedText>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <ScrollView className="w-full" showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <View className="space-y-3 w-full">
            {displayCharges.map((charge) => (
              <View
                key={charge.id}
                className="flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={`h-10 w-10 rounded-full items-center justify-center mr-3 ${
                      charge.status === CHARGE_STATUS.PAID
                        ? "bg-green-100 dark:bg-green-900/30"
                        : charge.status === CHARGE_STATUS.PENDING
                        ? "bg-yellow-100 dark:bg-yellow-900/30"
                        : charge.status === CHARGE_STATUS.OVERDUE
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-gray-100 dark:bg-gray-900/30"
                    }`}
                  >
                    <Ionicons
                      name={getStatusIcon(charge.status) as any}
                      size={20}
                      className={getStatusColor(charge.status)}
                    />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="font-medium text-foreground">
                      {formatCurrency(charge.amount)}
                    </ThemedText>
                    <View className="flex-row items-center mt-1">
                      <ThemedText
                        className={cn(
                          "text-xs font-medium mr-2",
                          getStatusColor(charge.status)
                        )}
                      >
                        {getStatusLabel(charge.status)}
                      </ThemedText>
                      <ThemedText className="text-xs text-foreground/60">
                        {charge.paidAt
                          ? format(new Date(charge.paidAt), "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          : format(new Date(charge.dueDate), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </CardContent>
    </Card>
  );
}

