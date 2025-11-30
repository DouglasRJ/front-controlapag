import { Stack } from "expo-router";
import React from "react";

export default function ProviderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="services" />
      <Stack.Screen name="enrollments" />
      <Stack.Screen name="charges" />
      <Stack.Screen name="disputes" />
      <Stack.Screen name="organization" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}

