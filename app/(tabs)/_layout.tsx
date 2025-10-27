import { CustomHeader } from "@/components/custom-header";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { Tabs, useSegments } from "expo-router";
import React from "react";
import { StripeOnboardingModal } from "../onboarding/stripe";

export default function TabLayout() {
  const { user } = useAuthStore();
  const providerStatus = user?.providerProfile?.status;
  const userRole = user?.role;
  const isProvider = userRole === USER_ROLE.PROVIDER;
  const isClient = userRole === USER_ROLE.CLIENT;
  const segments = useSegments();
  const currentRouteName = segments[segments.length - 1];
  const isOnStripeConfiguredRoute = currentRouteName === "stripe-configured";
  const showOnboardingModal =
    isProvider && providerStatus !== "ACTIVE" && !isOnStripeConfiguredRoute;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            display: "none",
          },
          header: (props) => <CustomHeader />,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="stripe-configured" />

        {isProvider && (
          <>
            <Tabs.Screen name="(provider)" />
            <Tabs.Screen name="(provider)/services" />
            <Tabs.Screen name="(provider)/enrollments" />
          </>
        )}

        {isClient && <Tabs.Screen name="(client)" />}
      </Tabs>
      <StripeOnboardingModal visible={showOnboardingModal} />
    </>
  );
}
