import { TabBarIcon } from "@/components/tabbar-icon";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { Tabs } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function TabLayout() {
  const { logout, user } = useAuthStore();
  const userRole = user?.role;
  console.log("user", user);
  const isProvider = userRole === USER_ROLE.PROVIDER;
  const isClient = userRole === USER_ROLE.CLIENT;

  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          headerRight: () => (
            <Button onPress={logout} title="Sair" color={"#FF0000"} />
          ),
        }}
      />

      {isProvider && (
        <Tabs.Screen
          name="(provider)"
          options={{
            title: "Serviços",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "briefcase" : "briefcase-outline"}
                color={color}
              />
            ),
          }}
        />
      )}

      {isClient && (
        <Tabs.Screen
          name="(client)"
          options={{
            title: "Cobranças",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "wallet" : "wallet-outline"}
                color={color}
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
