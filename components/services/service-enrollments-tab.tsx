import { ThemedText } from "@/components/themed-text";
import { Enrollments } from "@/types/enrollments";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import { Button } from "../ui/button";
import { EnrollmentCard } from "./enrollment-card";

type ServiceEnrollmentsTabProps = {
  enrollments: Enrollments[] | undefined | null;
  serviceId: string | undefined;
};

export function ServiceEnrollmentsTab({
  enrollments,
  serviceId,
}: ServiceEnrollmentsTabProps) {
  const handleNewEnrollment = () => {
    if (!serviceId) return;
    router.push(`/(tabs)/(provider)/enrollments/new?serviceId=${serviceId}`);
  };

  return (
    <View className="w-full gap-5 px-5 pt-5 flex-1">
      <Button
        title="+ Novo Contrato"
        onPress={handleNewEnrollment}
        disabled={!serviceId}
      ></Button>

      <FlatList
        data={enrollments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EnrollmentCard serviceId={serviceId} enrollment={item} />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-10">
            <ThemedText className="text-foreground text-sm">
              Nenhum contrato neste serviço.
            </ThemedText>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
