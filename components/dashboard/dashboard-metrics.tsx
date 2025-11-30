import { useOperationalMetrics } from "@/hooks/use-provider";
import { formatCurrency } from "@/utils/format-currency";
import React from "react";
import { View } from "react-native";
import { MetricCard } from "./metric-card";
import { SkeletonCard } from "../ui/skeleton";
import { ErrorState } from "../ui/error-state";
import { FadeInView } from "../ui/fade-in-view";

export function DashboardMetrics() {
  const { data: metrics, isLoading, error, refetch } = useOperationalMetrics();

  if (isLoading) {
    return (
      <View className="w-full gap-4 md:gap-8 flex-row flex-wrap justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard
            key={index}
            showHeader={true}
            showFooter={false}
            lines={2}
            className="flex-1 min-w-36"
          />
        ))}
      </View>
    );
  }

  if (error || !metrics) {
    return (
      <ErrorState
        variant="compact"
        title="Erro ao carregar métricas"
        message={error ? "Não foi possível carregar as métricas." : "Dados indisponíveis."}
        onRetry={refetch}
      />
    );
  }

  const metricCards = [
    {
      icon: "cash-outline" as const,
      value: formatCurrency(metrics.monthlyRevenue),
      label: "Recebido do mês",
    },
    {
      icon: "calendar-outline" as const,
      value: `${metrics.activeEnrollments}`,
      label: `Contratos ativos`,
    },
    {
      icon: "people-outline" as const,
      value: `${metrics.clientMetrics.total} ${metrics.clientMetrics.total > 1 ? "Clientes" : "Cliente"}`,
      label: `${metrics.clientMetrics.newThisMonth} ${metrics.clientMetrics.newThisMonth > 1 ? "novos" : "novo"}`,
    },
    {
      icon: "time-outline" as const,
      value: `${metrics.weeklyGrowth}% Ocupação`,
      label: "Média semanal",
    },
  ];

  return (
    <View className="w-full gap-4 md:gap-8 flex-row flex-wrap">
      {metricCards.map((card, index) => (
        <FadeInView 
          key={index} 
          delay={index * 100} 
          className="flex-1 min-w-[48%]"
        >
          <View className="h-full">
            <MetricCard
              icon={card.icon}
              value={card.value}
              label={card.label}
            />
          </View>
        </FadeInView>
      ))}
    </View>
  );
}
