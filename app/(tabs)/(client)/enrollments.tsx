import { EnrollmentsCardClient } from "@/components/servicesCardClient";
import React from "react";
import { ScrollView, View } from "react-native";

export default function ClientsChargeScreen() {
  return (
    <View className="flex-1 flex-grow items-center pt-5 bg-background dark:bg-dark-background">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="items-center justify-center p-5 w-full gap-8">
          <EnrollmentsCardClient />
        </View>
      </ScrollView>
    </View>
  );
}
