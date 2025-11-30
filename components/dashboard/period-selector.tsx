import React from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Period = "7d" | "30d" | "90d";

type PeriodSelectorProps = {
  period: Period;
  onPeriodChange: (period: Period) => void;
};

const periodLabels: Record<Period, string> = {
  "7d": "7 dias",
  "30d": "30 dias",
  "90d": "90 dias",
};

export function PeriodSelector({
  period,
  onPeriodChange,
}: PeriodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ThemedText className="text-lg font-semibold">Período</ThemedText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <View className="flex-row gap-2">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <Pressable
              key={p}
              onPress={() => onPeriodChange(p)}
              className={`px-4 py-2 rounded-lg ${
                period === p
                  ? "bg-primary"
                  : "bg-muted border border-border"
              }`}
            >
              <ThemedText
                className={`text-sm font-medium ${
                  period === p
                    ? "text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {periodLabels[p]}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

