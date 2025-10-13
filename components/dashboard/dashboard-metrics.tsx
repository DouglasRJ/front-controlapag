import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { OperationalMetrics } from "@/types/operational-metrics";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";
import { MetricCard } from "./metric-card";

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isHydrated = useAuthHydration();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await api.get<OperationalMetrics>(
          "/dashboard/operational-metrics"
        );
        setMetrics(response.data);
      } catch (err) {
        setError("Não foi possível carregar as métricas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isHydrated]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !metrics) {
    return (
      <View style={styles.container}>
        <ThemedText>{error || "Dados indisponíveis."}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MetricCard
        icon="cash-outline"
        value={formatCurrency(metrics.monthlyRevenue)}
        label="Recebido do mês"
      />
      <MetricCard
        icon="calendar-outline"
        value={`${metrics.activeEnrollments}`}
        label={`Agendamentos`}
      />
      <MetricCard
        icon="people-outline"
        value={`${metrics.clientMetrics.total} ${metrics.clientMetrics.total > 1 ? "clientes" : "cliente"}`}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
