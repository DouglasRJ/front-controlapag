import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

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
  const positiveColor = "#10B981";
  const negativeColor = "#EF4444";
  const isPositive =
    percentageChange !== undefined &&
    percentageChange !== null &&
    percentageChange >= 0;
  const changeColor = isPositive ? positiveColor : negativeColor;

  return (
    <View className="flex-1 min-w-36 bg-card p-2 rounded-xl justify-between gap-2">
      <View className="flex-row justify-between items-center relative">
        <Ionicons name={icon} size={16} className="text-card-foreground" />
        {percentageChange !== undefined && percentageChange !== null && (
          <View className="flex-row items-center absolute right-0">
            <Ionicons
              name={isPositive ? "arrow-up" : "arrow-down"}
              color={changeColor}
              size={14}
            />
            <ThemedText
              className="text-xs font-medium ml-0.5"
              style={{ color: changeColor }}
            >
              {Math.abs(percentageChange)}%
            </ThemedText>
          </View>
        )}
      </View>

      <View>
        <ThemedText className="font-semibold text-primary">{value}</ThemedText>
        <ThemedText className="text-xs text-card-foreground">
          {label}
        </ThemedText>
      </View>
    </View>
  );
}
