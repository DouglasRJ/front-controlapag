import { CustomHeader } from "@/components/custom-header";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { user } = useAuthStore();

  const userRole = user?.role;
  const isProvider = userRole === USER_ROLE.PROVIDER;
  const isClient = userRole === USER_ROLE.CLIENT;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: "none",
        },
        header: (props) => <CustomHeader />,
      }}
    >
      <Tabs.Screen name="index" />

      {isProvider && <Tabs.Screen name="(provider)" />}

      {isClient && <Tabs.Screen name="(client)" />}
    </Tabs>
  );
}
