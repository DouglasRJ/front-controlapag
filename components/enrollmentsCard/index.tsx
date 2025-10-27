import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Enrollments } from "@/types/enrollments";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { EnrollmentCard } from "../services/enrollment-card";
import { ThemedText } from "../themed-text";

export function EnrollmentsCard() {
  const [enrollments, setEnrollments] = useState<Enrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isHydrated = useAuthHydration();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await api.get<Enrollments[]>("/provider/enrollments");
        setEnrollments(response.data);
      } catch (err) {
        setError("Não foi possível carregar as métricas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isHydrated]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <ThemedText>{error || "Dados indisponíveis."}</ThemedText>
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
