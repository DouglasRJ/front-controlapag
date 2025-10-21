export interface OperationalMetrics {
  monthlyRevenue: number;
  activeEnrollments: number;
  clientMetrics: ClientMetrics;
  weeklyGrowth: number;
}

export interface ClientMetrics {
  total: number;
  newThisMonth: number;
}
