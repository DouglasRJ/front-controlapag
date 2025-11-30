import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { useFinancialSummary } from "@/hooks/use-financial-summary";
import { useOperationalMetrics } from "@/hooks/use-provider";
import { useRecentCharges } from "@/hooks/use-recent-charges";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

type Period = "7d" | "30d" | "90d";

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data: financialSummary, isLoading: isLoadingFinancial } =
    useFinancialSummary();
  const { data: metrics, isLoading: isLoadingMetrics } =
    useOperationalMetrics();
  const { data: recentCharges, isLoading: isLoadingCharges } =
    useRecentCharges(20);

  // Mock data for revenue chart - in real app, this would come from API
  const revenueData = Array.from({ length: period === "7d" ? 7 : period === "30d" ? 30 : 90 }, (_, i) => ({
    date: new Date(Date.now() - (period === "7d" ? 7 - i : period === "30d" ? 30 - i : 90 - i) * 24 * 60 * 60 * 1000).toISOString(),
    revenue: Math.random() * 1000 + 500,
  }));

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="p-5 w-full gap-6">
          {/* Header */}
          <View className="mb-4">
            <ThemedText className="text-3xl font-bold text-foreground mb-2">
              Analytics Financeiro
            </ThemedText>
            <ThemedText className="text-sm text-foreground/60">
              Visão detalhada da saúde financeira do seu negócio
            </ThemedText>
          </View>

          {/* Period Selector */}
          <PeriodSelector period={period} onPeriodChange={setPeriod} />

          {/* Financial Summary Cards */}
          <View className="gap-4 flex-row flex-wrap">
            {financialSummary && (
              <>
                <StatCard
                  title="Saldo Disponível"
                  value={formatCurrency(financialSummary.balance.available)}
                  icon="wallet-outline"
                  description="Pronto para saque"
                />
                <StatCard
                  title="Saldo Pendente"
                  value={formatCurrency(financialSummary.balance.pending)}
                  icon="time-outline"
                  description="Aguardando processamento"
                />
              </>
            )}
            {metrics && (
              <>
                <StatCard
                  title="Receita do Mês"
                  value={formatCurrency(metrics.monthlyRevenue)}
                  icon="cash-outline"
                  description="Total recebido"
                />
                <StatCard
                  title="Contratos Ativos"
                  value={String(metrics.activeEnrollments)}
                  icon="calendar-outline"
                  description="Em andamento"
                />
              </>
            )}
          </View>

          {/* Revenue Chart */}
          <RevenueChart data={revenueData} period={period} />

          {/* Additional Metrics */}
          {metrics && (
            <View className="gap-4 flex-row flex-wrap">
              <StatCard
                title="Total de Clientes"
                value={String(metrics.clientMetrics.total)}
                icon="people-outline"
                description={`${metrics.clientMetrics.newThisMonth} novos este mês`}
              />
              <StatCard
                title="Ocupação Semanal"
                value={`${metrics.weeklyGrowth}%`}
                icon="trending-up-outline"
                description="Crescimento semanal"
              />
            </View>
          )}

          {/* Recent Payouts */}
          {financialSummary && financialSummary.recentPayouts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <ThemedText className="text-xl font-semibold">
                    Saques Recentes
                  </ThemedText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <View className="space-y-3">
                  {financialSummary.recentPayouts.slice(0, 5).map((payout) => (
                    <View
                      key={payout.id}
                      className="flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="h-10 w-10 rounded-full items-center justify-center mr-3 bg-primary/10">
                          <Ionicons
                            name="arrow-down-circle-outline"
                            size={20}
                            className="text-primary"
                          />
                        </View>
                        <View className="flex-1">
                          <ThemedText className="font-medium text-foreground">
                            {formatCurrency(payout.amount)}
                          </ThemedText>
                          <ThemedText className="text-xs text-foreground/60 mt-1">
                            {new Date(payout.arrival_date).toLocaleDateString(
                              "pt-BR"
                            )}
                          </ThemedText>
                        </View>
                      </View>
                      <View className="px-3 py-1 rounded-full bg-muted">
                        <ThemedText className="text-xs font-medium text-foreground">
                          {payout.status}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Recent Transactions */}
          <TransactionList
            charges={recentCharges}
            isLoading={isLoadingCharges}
            limit={20}
          />
        </View>
      </ScrollView>
    </View>
  );
}
