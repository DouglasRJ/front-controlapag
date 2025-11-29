import { useOperationalMetrics } from "@/hooks/use-provider";
import { formatCurrency } from "@/utils/format-currency";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemedText } from "../themed-text";
import { MetricCard } from "./metric-card";

export function DashboardMetrics() {
  const { data: metrics, isLoading, error } = useOperationalMetrics();

  if (isLoading) {
    return (
      <View className="flex-row flex-wrap justify-between">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !metrics) {
    return (
      <View className="flex-row flex-wrap justify-between">
        <ThemedText>
          {error ? "Não foi possível carregar as métricas." : "Dados indisponíveis."}
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="w-full gap-4 md:gap-8 flex-row flex-wrap justify-between">
      <MetricCard
        icon="cash-outline"
        value={formatCurrency(metrics.monthlyRevenue)}
        label="Recebido do mês"
      />
      <MetricCard
        icon="calendar-outline"
        value={`${metrics.activeEnrollments}`}
        label={`Contratos ativos`}
      />
      <MetricCard
        icon="people-outline"
        value={`${metrics.clientMetrics.total} ${metrics.clientMetrics.total > 1 ? "Clientes" : "Cliente"}`}
        label={`${metrics.clientMetrics.newThisMonth} ${metrics.clientMetrics.newThisMonth > 1 ? "novos" : "novo"}`}
      />
      <MetricCard
        icon="time-outline"
        value={`${metrics.weeklyGrowth}% Ocupação`}
        label="Média semanal"
      />
    </View>
  );
}
