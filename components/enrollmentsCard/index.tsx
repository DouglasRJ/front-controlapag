import { useProviderEnrollments } from "@/hooks/use-enrollments";
import React from "react";
import { View } from "react-native";
import { EnrollmentCard } from "../services/enrollment-card";
import { ThemedText } from "../themed-text";
import { SkeletonCard } from "../ui/skeleton";
import { ErrorState } from "../ui/error-state";
import { EmptyState } from "../ui/empty-state";
import { FadeInView } from "../ui/fade-in-view";

export function EnrollmentsCard() {
  const { data: enrollments = [], isLoading, error, refetch } = useProviderEnrollments();

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
        {isLoading ? (
          <View className="gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <SkeletonCard
                key={index}
                showHeader={true}
                showFooter={false}
                lines={2}
              />
            ))}
          </View>
        ) : error ? (
          <ErrorState
            variant="inline"
            title="Erro ao carregar contratos"
            message={error ? "Não foi possível carregar os contratos." : "Dados indisponíveis."}
            onRetry={refetch}
          />
        ) : enrollments.length ? (
          enrollments.map((enrollment, index) => (
            <FadeInView key={enrollment.id} delay={index * 50}>
              <EnrollmentCard
                enrollment={enrollment}
                size="small"
              />
            </FadeInView>
          ))
        ) : (
          <EmptyState
            icon="document-text-outline"
            title="Nenhum contrato ativo"
            description="Quando você tiver contratos ativos, eles aparecerão aqui."
            className="py-8"
          />
        )}
      </View>
    </View>
  );
}
