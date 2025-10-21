import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { EnrollmentsCard } from "@/components/enrollmentsCard";
import { ServicesCard } from "@/components/servicesCard";
import { ScrollView, View } from "react-native";

export default function ProviderServicesScreen() {
  return (
    <View className="flex-1 flex-grow items-center pt-5 bg-background dark:bg-dark-background">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="items-center justify-center p-5 w-full gap-8">
          <DashboardMetrics />
          <ServicesCard />
          <EnrollmentsCard />
        </View>
      </ScrollView>
    </View>
  );
}
