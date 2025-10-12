import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function ClientLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const userRole = user?.role;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (userRole !== USER_ROLE.CLIENT) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="charges" options={{ title: "Minhas Cobranças" }} />
    </Stack>
  );
}
