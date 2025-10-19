// app/(tabs)/_layout.tsx
import { CustomHeader } from "@/components/custom-header";
import { TabBarIcon } from "@/components/tabbar-icon"; //
import { useAuthStore } from "@/store/authStore"; //
import { USER_ROLE } from "@/types/user-role"; //
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { logout, user } = useAuthStore(); //

  const userRole = user?.role; //
  const isProvider = userRole === USER_ROLE.PROVIDER; //
  const isClient = userRole === USER_ROLE.CLIENT; //

  return (
    <Tabs
      screenOptions={{
        // Aplica o header customizado a todas as telas neste layout de Tabs
        // O React Navigation passará props automaticamente para MyCustomNavHeader
        header: (props) => <CustomHeader />,
        // Você pode manter outras screenOptions aqui se necessário
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // Exemplo
      }}
    >
      <Tabs.Screen
        name="index" //
        options={{
          title: "Início", //
          tabBarIcon: (
            { color, focused } //
          ) => (
            <TabBarIcon //
              name={focused ? "home" : "home-outline"} //
              color={color} //
            />
          ),
          // headerRight: () => ( // Removido daqui, pois está no header customizado
          //   <Button onPress={logout} title="Sair" color={"#FF0000"} />
          // ),
          // headerShown: true, // Garante que o header seja mostrado (se screenOptions não for usado)
        }}
      />

      {isProvider && ( //
        <Tabs.Screen
          name="(provider)" //
          options={{
            title: "Serviços", //
            // headerShown: true, // Herdará de screenOptions
            tabBarIcon: (
              { color, focused } //
            ) => (
              <TabBarIcon //
                name={focused ? "briefcase" : "briefcase-outline"} //
                color={color} //
              />
            ),
          }}
        />
      )}

      {isClient && ( //
        <Tabs.Screen
          name="(client)" //
          options={{
            title: "Cobranças", //
            // headerShown: true, // Herdará de screenOptions
            tabBarIcon: (
              { color, focused } //
            ) => (
              <TabBarIcon //
                name={focused ? "wallet" : "wallet-outline"} //
                color={color} //
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
