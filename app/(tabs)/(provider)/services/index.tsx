import { CustomHeader } from "@/components/custom-header";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { EnrollmentsCard } from "@/components/enrollmentsCard";
import { ServicesCard } from "@/components/servicesCard";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProviderServicesScreen() {
  return (
    <ThemedView style={styles.pageContainer}>
      <CustomHeader />
      <ScrollView style={{ width: "100%", paddingBottom: 80 }}>
        <View style={styles.container}>
          <DashboardMetrics />
          <ServicesCard />
          <EnrollmentsCard />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  contentWrapper: {
    padding: 20,
    backgroundColor: "#333333",
    borderRadius: 10,
    alignItems: "center",
  },
});
