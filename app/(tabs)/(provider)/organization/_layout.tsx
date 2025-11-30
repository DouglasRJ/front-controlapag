import { Stack } from "expo-router";
import React from "react";

export default function OrganizationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="members" />
      <Stack.Screen name="invite" />
    </Stack>
  );
}

