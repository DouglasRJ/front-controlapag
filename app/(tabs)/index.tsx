import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { isProviderRole } from "@/utils/user-role";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const isProvider = isProviderRole(userRole);
  const isClient = userRole === USER_ROLE.CLIENT;

  useEffect(() => {
    // Redirecionar baseado no role
    if (isProvider) {
      router.replace("/(tabs)/(provider)/services");
    } else if (isClient) {
      router.replace("/(tabs)/(client)/enrollments");
    }
  }, [isProvider, isClient]);

  return <View className="flex-1 bg-background" />;
}

