import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useAuthStore } from "@/store/authStore";
import { useSidebar } from "@/store/sidebarStore";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";

export default function DashboardLayout() {
  const { isOpen, closeSidebar } = useSidebar();
  const { isAuthenticated } = useAuthStore();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // O redirecionamento é feito pelo InitialLayout no _layout.tsx
  // Mostra loading enquanto redireciona se não autenticado
  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <View className="flex-1 flex-row bg-background">
      {/* Sidebar */}
      {(!isMobile || isOpen) && (
        <DashboardSidebar
          isOpen={isOpen}
          onClose={closeSidebar}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      )}

      {/* Main Content */}
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(provider)" />
          <Stack.Screen name="(client)" />
        </Stack>
      </View>
    </View>
  );
}

