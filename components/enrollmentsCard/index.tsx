import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Enrollments } from "@/types/enrollments";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
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
            Agendamentos de Hoje
          </ThemedText>
          <ThemedText className="-mb-1.5 text-xs text-card-foreground font-light">
            Próximos compromissos
          </ThemedText>
        </View>
      </View>
      <View>
        {enrollments.length ? (
          enrollments.map((enrollment) => (
            <ServiceCard key={enrollment.id} enrollment={enrollment} />
          ))
        ) : (
          <ThemedText className="text-xs text-card-foreground font-light text-center py-8">
            Nenhum agendamento para hoje
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const ServiceCard = ({ enrollment }: { enrollment: Enrollments }) => {
  return (
    <View className="pr-4 w-full min-h-16  rounded-lg mb-2 border-l-4 border-l-primary border-2 border-slate-200 py-2.5 px-2.5 justify-between">
      <View className="flex-row justify-between">
        <ThemedText className="text-card-foreground text-xs">
          {enrollment.startDate.toString()}
        </ThemedText>
        <ThemedText className="text-card-foreground font-light text-xs">
          {enrollment?.service?.name}
        </ThemedText>
      </View>
      <View className="flex-row gap-16">
        <View className="flex-row items-baseline gap-2.5">
          <ThemedText className="text-primary font-medium text-xs">
            {enrollment?.client?.user?.username}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
