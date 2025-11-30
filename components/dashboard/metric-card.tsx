import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

type MetricCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: string;
  label?: string; // Deprecated: use title instead
  title?: string; // New prop name matching example 10.3
  percentageChange?: number | null; // Deprecated: use change instead
  change?: number | null; // New prop name matching example 10.3
  trend?: "up" | "down" | "neutral";
};

export function MetricCard({
  icon,
  value,
  label,
  title,
  percentageChange,
  change,
  trend,
}: MetricCardProps) {
  // Support both old and new prop names for backward compatibility
  const displayTitle = title || label || "";
  const displayChange = change !== undefined ? change : percentageChange;

  const isPositive =
    displayChange !== undefined &&
    displayChange !== null &&
    displayChange >= 0;
  
  // Use trend prop if provided, otherwise infer from change
  const finalTrend = trend || (displayChange !== undefined && displayChange !== null
    ? (isPositive ? "up" : "down")
    : "neutral");

  const getTrendColor = () => {
    if (finalTrend === "up") return "text-success-600 dark:text-success-500";
    if (finalTrend === "down") return "text-error-600 dark:text-error-500";
    return "text-foreground/60";
  };

  const getTrendIcon = () => {
    if (finalTrend === "up") return "trending-up";
    if (finalTrend === "down") return "trending-down";
    return "remove";
  };

  return (
    <Card className="p-6 h-full">
      <View className="flex-row items-center justify-between mb-4">
        <ThemedText className="text-sm font-medium text-foreground/60">
          {displayTitle}
        </ThemedText>
        <Ionicons name={icon} size={20} className="text-primary" />
      </View>
      <ThemedText className="text-3xl font-bold text-foreground mb-2">
        {value}
      </ThemedText>
      {displayChange !== undefined && displayChange !== null && (
        <View className="flex-row items-center">
          <Ionicons
            name={getTrendIcon() as any}
            size={16}
            className={getTrendColor()}
          />
          <ThemedText
            className={cn("text-sm ml-1", getTrendColor())}
          >
            {Math.abs(displayChange)}%
          </ThemedText>
        </View>
      )}
    </Card>
  );
}
