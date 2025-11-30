import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { EnrollmentsCard } from "@/components/enrollmentsCard";
import { ServicesCard } from "@/components/servicesCard";
import { chargeKeys } from "@/hooks/use-charges";
import { enrollmentKeys } from "@/hooks/use-enrollments";
import { FinancialSummary, financialKeys, useFinancialSummary } from "@/hooks/use-financial-summary";
import { providerKeys } from "@/hooks/use-provider";
import { useRecentCharges } from "@/hooks/use-recent-charges";
import { serviceKeys } from "@/hooks/use-services";
import { BILLING_TYPE } from "@/types/billing-type";
import { CHARGE_STATUS } from "@/types/charge-status";
import { ENROLLMENT_STATUS } from "@/types/enrollment-status";
import { Enrollments } from "@/types/enrollments";
import { OperationalMetrics } from "@/types/operational-metrics";
import { PAYMENT_METHOD } from "@/types/payment-method";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { useQueryClient } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";

// MOCK DATA
const mockFinancialSummary = {
  balance: {
    available: 15420.50,
    pending: 3250.00,
  },
  recentPayouts: [],
};

const mockRecentCharges = [
  {
    id: "1",
    amount: 500.00,
    dueDate: new Date(),
    status: CHARGE_STATUS.PAID,
    paidAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollmentId: "enrollment-1",
  },
  {
    id: "2",
    amount: 750.00,
    dueDate: subDays(new Date(), 2),
    status: CHARGE_STATUS.PENDING,
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 2),
    enrollmentId: "enrollment-2",
  },
  {
    id: "3",
    amount: 1200.00,
    dueDate: subDays(new Date(), 5),
    status: CHARGE_STATUS.OVERDUE,
    createdAt: subDays(new Date(), 10),
    updatedAt: subDays(new Date(), 5),
    enrollmentId: "enrollment-3",
  },
  {
    id: "4",
    amount: 300.00,
    dueDate: subDays(new Date(), 1),
    status: CHARGE_STATUS.PAID,
    paidAt: subDays(new Date(), 1),
    createdAt: subDays(new Date(), 3),
    updatedAt: subDays(new Date(), 1),
    enrollmentId: "enrollment-4",
  },
  {
    id: "5",
    amount: 950.00,
    dueDate: subDays(new Date(), 7),
    status: CHARGE_STATUS.PAID,
    paidAt: subDays(new Date(), 6),
    createdAt: subDays(new Date(), 12),
    updatedAt: subDays(new Date(), 6),
    enrollmentId: "enrollment-5",
  },
  {
    id: "6",
    amount: 600.00,
    dueDate: subDays(new Date(), 3),
    status: CHARGE_STATUS.IN_DISPUTE,
    createdAt: subDays(new Date(), 8),
    updatedAt: subDays(new Date(), 3),
    enrollmentId: "enrollment-6",
  },
  {
    id: "7",
    amount: 450.00,
    dueDate: subDays(new Date(), 4),
    status: CHARGE_STATUS.PAID,
    paidAt: subDays(new Date(), 4),
    createdAt: subDays(new Date(), 6),
    updatedAt: subDays(new Date(), 4),
    enrollmentId: "enrollment-7",
  },
  {
    id: "8",
    amount: 800.00,
    dueDate: subDays(new Date(), 6),
    status: CHARGE_STATUS.REFUNDED,
    refundedAmount: 800.00,
    createdAt: subDays(new Date(), 15),
    updatedAt: subDays(new Date(), 6),
    enrollmentId: "enrollment-8",
  },
];

const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: subDays(new Date(), 29 - i).toISOString(),
  revenue: Math.floor(Math.random() * 2000) + 500,
}));

// Mock Services Data
const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Aulas de Piano",
    description: "Aulas particulares de piano para iniciantes e avançados",
    defaultPrice: 150.00,
    isActive: true,
    address: "Rua das Flores, 123",
    allowedPaymentMethods: [PAYMENT_METHOD.PIX, PAYMENT_METHOD.CREDIT_CARD],
    createdAt: new Date(),
    enrollments: [],
    isRecurrent: true,
  },
  {
    id: "service-2",
    name: "Consultoria em Marketing",
    description: "Consultoria especializada em estratégias de marketing digital",
    defaultPrice: 500.00,
    isActive: true,
    address: "Av. Paulista, 1000",
    allowedPaymentMethods: [PAYMENT_METHOD.PIX, PAYMENT_METHOD.BANK_SLIP],
    createdAt: new Date(),
    enrollments: [],
    isRecurrent: true,
  },
  {
    id: "service-3",
    name: "Personal Trainer",
    description: "Treinamento personalizado em academia ou domicílio",
    defaultPrice: 200.00,
    isActive: true,
    address: "",
    allowedPaymentMethods: [PAYMENT_METHOD.PIX, PAYMENT_METHOD.CASH],
    createdAt: new Date(),
    enrollments: [],
    isRecurrent: true,
  },
];

// Mock Enrollments Data
const mockEnrollments: Enrollments[] = [
  {
    id: "enrollment-1",
    price: 150.00,
    startDate: subDays(new Date(), 30),
    status: ENROLLMENT_STATUS.ACTIVE,
    billingType: BILLING_TYPE.RECURRING,
    createdAt: subDays(new Date(), 30),
    updatedAt: new Date(),
    chargeSchedule: {
      id: "schedule-1",
      frequency: "MONTHLY",
      dayOfMonth: 5,
    } as any,
    chargeExceptions: [],
    charges: [mockRecentCharges[0] as any],
    service: mockServices[0],
    client: {
      id: "client-1",
      phone: "(11) 99999-9999",
      address: "Rua Exemplo, 456",
      createdAt: new Date(),
      updatedAt: new Date(),
      enrollments: [],
      user: {
        id: "user-1",
        username: "João Silva",
        email: "joao@example.com",
      } as any,
    } as any,
  },
  {
    id: "enrollment-2",
    price: 500.00,
    startDate: subDays(new Date(), 15),
    status: ENROLLMENT_STATUS.ACTIVE,
    billingType: BILLING_TYPE.RECURRING,
    createdAt: subDays(new Date(), 15),
    updatedAt: new Date(),
    chargeSchedule: {
      id: "schedule-2",
      frequency: "MONTHLY",
      dayOfMonth: 10,
    } as any,
    chargeExceptions: [],
    charges: [mockRecentCharges[1] as any],
    service: mockServices[1],
    client: {
      id: "client-2",
      phone: "(11) 88888-8888",
      address: "Av. Exemplo, 789",
      createdAt: new Date(),
      updatedAt: new Date(),
      enrollments: [],
      user: {
        id: "user-2",
        username: "Maria Santos",
        email: "maria@example.com",
      } as any,
    } as any,
  },
];

// Mock Operational Metrics
const mockOperationalMetrics: OperationalMetrics = {
  monthlyRevenue: 18500.75,
  activeEnrollments: 12,
  clientMetrics: {
    total: 28,
    newThisMonth: 5,
  },
  weeklyGrowth: 15.5,
};

// Log mock data at module level to verify they exist
console.log("📦 [MOCK DATA] Module loaded with mock data:", {
  mockFinancialSummary,
  mockRecentCharges: mockRecentCharges.length,
  mockRevenueData: mockRevenueData.length,
  mockServices: mockServices.length,
  mockEnrollments: mockEnrollments.length,
  mockOperationalMetrics,
});

export default function ProviderServicesScreen() {
  console.log("🚀 [COMPONENT] ProviderServicesScreen component is rendering");

  const queryClient = useQueryClient();
  console.log("🚀 [COMPONENT] QueryClient obtained:", !!queryClient);

  // Set mock data immediately (before useEffect)
  // This ensures data is available even if useEffect doesn't run
  try {
    console.log("🔵 [MOCK] Setting mock data immediately (before useEffect)");

    // Mock Operational Metrics
    queryClient.setQueryData(providerKeys.operationalMetrics(), mockOperationalMetrics);

    // Mock Financial Summary
    queryClient.setQueryData(
      financialKeys.summary(),
      mockFinancialSummary as FinancialSummary
    );

    // Mock Recent Charges
    queryClient.setQueryData(
      [...chargeKeys.all, "recent", 10],
      mockRecentCharges as any
    );

    // Mock Services
    queryClient.setQueryData(serviceKeys.list(), mockServices);
    queryClient.setQueryData(serviceKeys.list({}), mockServices);
    queryClient.setQueryData(serviceKeys.list({ isActive: true }), mockServices);

    // Mock Enrollments
    queryClient.setQueryData(enrollmentKeys.provider(), mockEnrollments);

    console.log("✅ [MOCK] Mock data set immediately");
  } catch (error) {
    console.error("❌ [MOCK] Error setting mock data:", error);
  }

  // Pre-fill QueryClient with mock data (also in useEffect as backup)
  // This ensures all components have data to display
  useEffect(() => {
    console.log("🔵 [MOCK] useEffect: Starting to pre-fill QueryClient with mock data");

    // Mock Operational Metrics (for DashboardMetrics component)
    const operationalMetricsKey = providerKeys.operationalMetrics();
    queryClient.setQueryData(operationalMetricsKey, mockOperationalMetrics);
    console.log("✅ [MOCK] Operational Metrics set:", {
      key: operationalMetricsKey,
      data: mockOperationalMetrics,
      cached: queryClient.getQueryData(operationalMetricsKey)
    });

    // Mock Financial Summary (for StatCard components showing balance)
    const financialSummaryKey = financialKeys.summary();
    queryClient.setQueryData(
      financialSummaryKey,
      mockFinancialSummary as FinancialSummary
    );
    console.log("✅ [MOCK] Financial Summary set:", {
      key: financialSummaryKey,
      data: mockFinancialSummary,
      cached: queryClient.getQueryData(financialSummaryKey)
    });

    // Mock Recent Charges (for TransactionList component)
    const recentChargesKey = [...chargeKeys.all, "recent", 10];
    queryClient.setQueryData(
      recentChargesKey,
      mockRecentCharges as any
    );
    console.log("✅ [MOCK] Recent Charges set:", {
      key: recentChargesKey,
      data: mockRecentCharges,
      cached: queryClient.getQueryData(recentChargesKey)
    });

    // Mock Services (for ServicesCard component)
    // Pre-fill common filter combinations that might be used
    const commonServiceFilters = [
      undefined, // No filters
      {}, // Empty object
      { q: undefined }, // Search with no query
      { isActive: true }, // Active services only
      { isActive: false }, // Inactive services only
      { q: undefined, isActive: true }, // Search active
    ];
    commonServiceFilters.forEach((filters) => {
      const serviceKey = serviceKeys.list(filters);
      const serviceData = filters?.isActive === false ? [] : mockServices;
      queryClient.setQueryData(serviceKey, serviceData);
      console.log("✅ [MOCK] Services set:", {
        key: serviceKey,
        filters,
        data: serviceData,
        cached: queryClient.getQueryData(serviceKey)
      });
    });

    // Mock Enrollments (for EnrollmentsCard component)
    const enrollmentsKey = enrollmentKeys.provider();
    queryClient.setQueryData(enrollmentsKey, mockEnrollments);
    console.log("✅ [MOCK] Enrollments set:", {
      key: enrollmentsKey,
      data: mockEnrollments,
      cached: queryClient.getQueryData(enrollmentsKey)
    });

    console.log("🔵 [MOCK] Finished pre-filling QueryClient");
  }, [queryClient]);

  console.log("🔍 [HOOKS] About to call useFinancialSummary and useRecentCharges");

  const { data: financialSummary, isLoading: isLoadingFinancial } =
    useFinancialSummary();
  const { data: recentCharges, isLoading: isLoadingCharges } =
    useRecentCharges(10);

  console.log("🔍 [HOOKS] Hooks called, results:", {
    financialSummary: !!financialSummary,
    financialSummaryData: financialSummary,
    isLoadingFinancial,
    recentCharges: !!recentCharges,
    recentChargesLength: recentCharges?.length,
    isLoadingCharges,
  });

  // Use mock data as fallback if hooks don't return data
  const displayFinancialSummary = financialSummary || (mockFinancialSummary as FinancialSummary);
  const displayRecentCharges = recentCharges || (mockRecentCharges as any);

  console.log("🔍 [HOOKS] After fallback:", {
    displayFinancialSummary: !!displayFinancialSummary,
    displayFinancialSummaryData: displayFinancialSummary,
    displayRecentCharges: !!displayRecentCharges,
    displayRecentChargesLength: displayRecentCharges?.length,
  });

  // Debug logs
  console.log("🔍 [HOOKS] Financial Summary:", {
    fromHook: financialSummary,
    fromMock: mockFinancialSummary,
    display: displayFinancialSummary,
    isLoading: isLoadingFinancial,
    queryKey: financialKeys.summary(),
    cached: queryClient.getQueryData(financialKeys.summary())
  });

  console.log("🔍 [HOOKS] Recent Charges:", {
    fromHook: recentCharges,
    fromMock: mockRecentCharges,
    display: displayRecentCharges,
    isLoading: isLoadingCharges,
    queryKey: [...chargeKeys.all, "recent", 10],
    cached: queryClient.getQueryData([...chargeKeys.all, "recent", 10])
  });

  console.log("🔍 [HOOKS] Operational Metrics cached:", {
    queryKey: providerKeys.operationalMetrics(),
    cached: queryClient.getQueryData(providerKeys.operationalMetrics())
  });

  console.log("🔍 [HOOKS] Services cached:", {
    queryKey: serviceKeys.list(),
    cached: queryClient.getQueryData(serviceKeys.list())
  });

  console.log("🔍 [HOOKS] Enrollments cached:", {
    queryKey: enrollmentKeys.provider(),
    cached: queryClient.getQueryData(enrollmentKeys.provider())
  });

  // Render debug logs
  console.log("🎨 [RENDER] Component rendering with:", {
    displayFinancialSummary: !!displayFinancialSummary,
    displayFinancialSummaryData: displayFinancialSummary,
    displayRecentCharges: !!displayRecentCharges,
    displayRecentChargesLength: displayRecentCharges?.length,
    willShowFinancialCards: !!displayFinancialSummary,
  });

  return (
    <View className="flex-1 flex-grow items-center pt-5 bg-background dark:bg-dark-background">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="items-center justify-center p-5 w-full gap-8">
          <DashboardMetrics />

          {/* Financial Summary Cards - Always show with mock data */}
          {(() => {
            console.log("🎨 [RENDER] Checking if should render Financial Summary Cards:", {
              displayFinancialSummary: !!displayFinancialSummary,
              balance: displayFinancialSummary?.balance,
            });
            if (!displayFinancialSummary) {
              console.warn("⚠️ [RENDER] Financial Summary Cards NOT rendered - displayFinancialSummary is falsy");
              return null;
            }
            return (
              <View className="w-full gap-4 flex-row flex-wrap">
                <StatCard
                  title="Saldo Disponível"
                  value={formatCurrency(displayFinancialSummary.balance.available)}
                  icon="wallet-outline"
                  description="Pronto para saque"
                />
                <StatCard
                  title="Saldo Pendente"
                  value={formatCurrency(displayFinancialSummary.balance.pending)}
                  icon="time-outline"
                  description="Aguardando processamento"
                />
              </View>
            );
          })()}

          {/* Revenue Chart */}
          <RevenueChart
            data={mockRevenueData}
            isLoading={false}
            period="30d"
          />

          {/* Recent Transactions */}
          <TransactionList
            charges={displayRecentCharges}
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
