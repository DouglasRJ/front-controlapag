import { EnrollmentCard } from "@/components/services/enrollment-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { FadeInView } from "@/components/ui/fade-in-view";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useProviderEnrollments } from "@/hooks/use-enrollments";
import { router } from "expo-router";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";

export default function ProviderEnrollmentsScreen() {
    const { data: enrollments = [], isLoading, error, refetch } = useProviderEnrollments();

    const handleNewEnrollment = () => {
        router.push("/(tabs)/(provider)/enrollments/new");
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-background p-5">
                <View className="gap-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonCard
                            key={index}
                            showHeader={true}
                            showFooter={false}
                            lines={2}
                        />
                    ))}
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-background p-5">
                <ErrorState
                    variant="inline"
                    title="Erro ao carregar contratos"
                    message="Não foi possível carregar os contratos. Tente novamente."
                    onRetry={refetch}
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                className="w-full"
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <View className="p-5 gap-5">
                    <View className="flex-row items-center justify-between mb-2">
                        <View>
                            <ThemedText className="text-2xl font-bold text-foreground">
                                Contratos
                            </ThemedText>
                            <ThemedText className="text-sm text-muted-foreground mt-1">
                                Gerencie todos os seus contratos
                            </ThemedText>
                        </View>
                        <Button
                            title="+ Novo Contrato"
                            onPress={handleNewEnrollment}
                        />
                    </View>

                    {enrollments.length === 0 ? (
                        <EmptyState
                            icon="document-text-outline"
                            title="Nenhum contrato encontrado"
                            description="Quando você criar contratos, eles aparecerão aqui."
                            className="py-12"
                        />
                    ) : (
                        <FlatList
                            data={enrollments}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <FadeInView key={item.id} delay={index * 50}>
                                    <EnrollmentCard enrollment={item} size="large" />
                                </FadeInView>
                            )}
                            scrollEnabled={false}
                            contentContainerStyle={{ gap: 12 }}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

