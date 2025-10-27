import { ThemedText } from "@/components/themed-text";
import { ENROLLMENT_STATUS } from "@/types/enrollment-status";
import { Enrollments } from "@/types/enrollments";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, View } from "react-native";
import { Button } from "../ui/button";
import { EnrollmentCard } from "./enrollment-card";

type ServiceEnrollmentsTabProps = {
  enrollments: Enrollments[] | undefined | null;
  serviceId: string | undefined;
};

const statusOrder: { [key in ENROLLMENT_STATUS]: number } = {
  [ENROLLMENT_STATUS.ACTIVE]: 1,
  [ENROLLMENT_STATUS.COMPLETED]: 2,
  [ENROLLMENT_STATUS.INACTIVE]: 3,
  [ENROLLMENT_STATUS.CANCELLED]: 4,
};

export function ServiceEnrollmentsTab({
  enrollments,
  serviceId,
}: ServiceEnrollmentsTabProps) {
  const handleNewEnrollment = () => {
    if (!serviceId) return;
    router.push(`/(tabs)/(provider)/enrollments/new?serviceId=${serviceId}`);
  };

  const sortedEnrollments = useMemo(() => {
    if (!enrollments) return [];

    return [...enrollments].sort((a, b) => {
      const orderA = statusOrder[a.status] ?? 99;
      const orderB = statusOrder[b.status] ?? 99;
      return orderA - orderB;
    });
  }, [enrollments]);
  return (
    <View className="w-full gap-5 px-5 pt-5 flex-1">
      <Button
        title="+ Novo Contrato"
        onPress={handleNewEnrollment}
        disabled={!serviceId}
      ></Button>

      <FlatList
        data={sortedEnrollments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EnrollmentCard enrollment={item} />}
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
