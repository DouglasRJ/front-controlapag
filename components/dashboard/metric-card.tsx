import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

type MetricCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: string;
  label: string;
  percentageChange?: number | null;
};

export function MetricCard({
  icon,
  value,
  label,
  percentageChange,
}: MetricCardProps) {
  const cardColor = useThemeColor({}, "card");
  const iconColor = useThemeColor({}, "tint");
  const positiveColor = "#10B981";
  const negativeColor = "#EF4444";

  const isPositive =
    percentageChange !== undefined &&
    percentageChange !== null &&
    percentageChange >= 0;
  const changeColor = isPositive ? positiveColor : negativeColor;

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardColor }]}>
      <View style={styles.header}>
        <Ionicons name={icon} size={16} color={iconColor} />
        {percentageChange !== undefined && percentageChange !== null && (
          <View style={styles.percentageContainer}>
            <Ionicons
              name={isPositive ? "arrow-up" : "arrow-down"}
              color={changeColor}
            />
            <ThemedText style={[styles.percentageText, { color: changeColor }]}>
              {Math.abs(percentageChange)}%
            </ThemedText>
          </View>
        )}
      </View>
      <View>
        <ThemedText style={[styles.valueText, { color: iconColor }]}>
          {value}
        </ThemedText>
        <ThemedText style={[styles.labelText, { color: "#000000" }]}>
          {label}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 8,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "space-between",
    minHeight: 60,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valueText: {
    fontSize: 18,
    fontFamily: FontPoppins.MEDIUM,
  },
  labelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  percentageText: {
    fontSize: 12,
    fontFamily: FontPoppins.MEDIUM,
    marginLeft: 2,
  },
});
