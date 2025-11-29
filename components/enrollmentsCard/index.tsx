import { useProviderEnrollments } from "@/hooks/use-enrollments";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { EnrollmentCard } from "../services/enrollment-card";
import { ThemedText } from "../themed-text";

export function EnrollmentsCard() {
  const { data: enrollments = [], isLoading, error } = useProviderEnrollments();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <ThemedText>
          {error ? "Não foi possível carregar os contratos." : "Dados indisponíveis."}
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="bg-card w-full p-3 justify-between min-h-16 gap-8 rounded-lg">
      <View className="flex-row items-center justify-between">
        <View>
          <ThemedText className="font-semibold text-card-foreground">
            Contratos
          </ThemedText>
          <ThemedText className="-mb-1.5 text-xs text-card-foreground font-light">
            Gerencie seus contratos
          </ThemedText>
        </View>
      </View>
      <View>
        {enrollments.length ? (
          enrollments.map((enrollment) => (
            <EnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              size="small"
            />
          ))
        ) : (
          <ThemedText className="text-xs text-card-foreground font-light text-center py-8">
            Nenhum contrato ativo
          </ThemedText>
        )}
      </View>
    </View>
  );
}
