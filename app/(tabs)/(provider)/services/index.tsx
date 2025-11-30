import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { EnrollmentsCard } from "@/components/enrollmentsCard";
import { ServicesCard } from "@/components/servicesCard";
import { useFinancialSummary } from "@/hooks/use-financial-summary";
import { useRecentCharges } from "@/hooks/use-recent-charges";
import { formatCurrency } from "@/utils/format-currency";
import { ScrollView, View } from "react-native";

export default function ProviderServicesScreen() {
  const { data: financialSummary, isLoading: isLoadingFinancial } =
    useFinancialSummary();
  const { data: recentCharges, isLoading: isLoadingCharges } =
    useRecentCharges(10);

  // Mock data for revenue chart - in real app, this would come from API
  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
    revenue: Math.random() * 1000 + 500,
  }));

  return (
    <View className="flex-1 flex-grow items-center pt-5 bg-background dark:bg-dark-background">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="items-center justify-center p-5 w-full gap-8">
          <DashboardMetrics />

          {/* Financial Summary Cards */}
          {financialSummary && (
            <View className="w-full gap-4 md:gap-8 flex-row flex-wrap">
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
            </View>
          )}

          {/* Revenue Chart */}
          <RevenueChart
            data={revenueData}
            isLoading={false}
            period="30d"
          />

          {/* Recent Transactions */}
          <TransactionList
            charges={recentCharges}
            isLoading={isLoadingCharges}
            limit={10}
          />

          <ServicesCard />
          <EnrollmentsCard />
        </View>
      </ScrollView>
    </View>
  );
}
