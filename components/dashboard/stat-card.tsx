import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

type StatCardProps = {
  title: string;
  value: string;
  change?: number | null;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  description?: string;
  trend?: "up" | "down" | "neutral";
};

export function StatCard({
  title,
  value,
  change,
  icon,
  description,
  trend,
}: StatCardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-600 dark:text-green-500";
    if (trend === "down") return "text-red-600 dark:text-red-500";
    return "text-foreground/60";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "trending-up";
    if (trend === "down") return "trending-down";
    return "remove";
  };

  return (
    <View className="flex-1 min-w-[48%]">
      <Card className="p-6 h-full">
        <View className="flex-row items-center justify-between mb-4">
          <ThemedText className="text-sm font-medium text-foreground/60">
            {title}
          </ThemedText>
          <Ionicons name={icon} size={20} className="text-primary" />
        </View>
        <ThemedText className="text-3xl font-bold text-foreground mb-2">
          {value}
        </ThemedText>
        {change !== undefined && change !== null && (
          <View className="flex-row items-center mt-2">
            <Ionicons
              name={getTrendIcon() as any}
              size={16}
              className={getTrendColor()}
            />
            <ThemedText
              className={cn("text-sm ml-1 font-medium", getTrendColor())}
            >
              {Math.abs(change)}%
            </ThemedText>
            {description && (
              <ThemedText className="text-xs text-foreground/60 ml-2">
                {description}
              </ThemedText>
            )}
          </View>
        )}
        {!change && description && (
          <ThemedText className="text-xs text-foreground/60 mt-2">
            {description}
          </ThemedText>
        )}
      </Card>
    </View>

  );
}

