// app/(tabs)/_layout.tsx
import { TabBarIcon } from "@/components/tabbar-icon";
import { useAuthStore } from "@/store/authStore";
import { Tabs } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function TabLayout() {
  const { logout } = useAuthStore();

  return (
    <Tabs
      screenOptions={
        {
          // Aqui você pode estilizar suas abas
        }
      }
    >
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
      {/* Adicione outras abas aqui no futuro, por exemplo: */}
      {/*
      <Tabs.Screen
        name="services"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'briefcase' : 'briefcase-outline'} color={color} />
          ),
        }}
      />
      */}
    </Tabs>
  );
}
