import { ThemedText } from "@/components/themed-text";
import { ServiceOccurrence } from "@/types/service-ocurrency";
import { formatDate, formatTime } from "@/utils/format-date";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

type OccurrenceCardProps = {
  occurrence: ServiceOccurrence;
};

export function OccurrenceCard({ occurrence }: OccurrenceCardProps) {
  const handlePress = () => {
    if (!occurrence.enrollmentId) {
      console.warn("Enrollment ID is missing, cannot navigate");
      return;
    }
    router.push(`/(tabs)/(provider)/enrollments/${occurrence.enrollmentId}`);
  };

  const timeString = occurrence.startTime
    ? `${formatTime(occurrence.startTime)} ${occurrence.endTime ? `- ${formatTime(occurrence.endTime)}` : ""}`
    : "Dia todo";

  return (
    <Pressable onPress={handlePress} className="mb-3">
      <View className="w-full bg-card rounded-lg shadow-sm p-3 border border-border">
        <View className="flex-row justify-between items-center mb-1">
          <ThemedText className="text-card-foreground font-semibold">
            {formatDate(occurrence.date, "dd/MM/yyyy (EEE)")}
          </ThemedText>
          <ThemedText className="text-xs text-muted-foreground">
            {timeString}
          </ThemedText>
        </View>
        <ThemedText className="text-sm text-dark">
          Cliente:{" "}
          <ThemedText className="text-sm text-primary font-semibold">
            {occurrence.clientName}
          </ThemedText>
        </ThemedText>
      </View>
    </Pressable>
  );
}
