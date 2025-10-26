import { ThemedText } from "@/components/themed-text";
import { ENROLLMENT_STATUS } from "@/types/enrollment-status";
import { Enrollments } from "@/types/enrollments";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { getChargeFrequencySummary } from "@/utils/get-charge-frequency-summary";
import { getServiceFrequencySummary } from "@/utils/get-service-frequency-sumary";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

type EnrollmentCardProps = {
  enrollment: Enrollments;
  size?: "large" | "small";
};

const getStatusStyle = (status: ENROLLMENT_STATUS) => {
  switch (status) {
    case ENROLLMENT_STATUS.ACTIVE:
      return {
        bg: "bg-primary",
        text: "text-light ",
        border: "border-l-primary",
      };
    case ENROLLMENT_STATUS.INACTIVE:
      return {
        bg: "bg-yellow-100 ",
        text: "text-yellow-700 ",
        border: "border-l-yellow-500",
      };
    case ENROLLMENT_STATUS.CANCELLED:
      return {
        bg: "bg-red-100 ",
        text: "text-red-700 ",
        border: "border-l-red-500",
      };
    case ENROLLMENT_STATUS.COMPLETED:
      return {
        bg: "bg-gray-100 ",
        text: "text-gray-700 ",
        border: "border-l-gray-400",
      };
    default:
      return {
        bg: "bg-gray-100 ",
        text: "text-gray-700 ",
        border: "border-l-gray-300",
      };
  }
};

const getStatusText = (status: ENROLLMENT_STATUS) => {
  switch (status) {
    case ENROLLMENT_STATUS.ACTIVE:
      return "Ativo";
    case ENROLLMENT_STATUS.INACTIVE:
      return "Inativo";
    case ENROLLMENT_STATUS.CANCELLED:
      return "Cancelado";
    case ENROLLMENT_STATUS.COMPLETED:
      return "Concluído";
    default:
      return status;
  }
};

const getServiceScheduleSummaryText = (enrollment: Enrollments): string => {
  const schedules = enrollment.serviceSchedules;
  if (!schedules || schedules.length === 0) {
    const startDateFormatted = formatDate(enrollment.startDate);
    return `Data Única (${startDateFormatted})`;
  }
  const firstScheduleSummary = getServiceFrequencySummary(schedules[0]);

  if (schedules.length > 1) {
    return `${firstScheduleSummary} (+ ${schedules.length - 1} regra${schedules.length > 2 ? "s" : ""})`;
  }
  return firstScheduleSummary;
};

export function EnrollmentCard({
  enrollment,
  size = "large",
}: EnrollmentCardProps) {
  const statusStyle = getStatusStyle(enrollment.status);

  const handlePress = () => {
    router.push(
      `/(tabs)/(provider)/enrollments/${enrollment.id}?serviceId=${enrollment.service?.id}`
    );
  };

  const serviceSummary = getServiceScheduleSummaryText(enrollment);

  if (size === "small") {
    return (
      <Pressable onPress={handlePress} className="mb-2">
        <View
          className={`pr-4 w-full min-h-16 rounded-lg border-l-4 ${statusStyle.border} border-2 border-slate-200 bg-card py-2.5 px-2.5 justify-between`}
        >
          <View className="flex-row justify-between items-center mb-1">
            <ThemedText
              className="text-card-foreground text-xs font-medium flex-shrink mr-2"
              numberOfLines={1}
            >
              {enrollment?.service?.name ?? "Serviço Indefinido"}
            </ThemedText>
            <ThemedText
              className={`text-xs font-medium px-1.5 py-0.5 rounded ${statusStyle.bg} ${statusStyle.text}`}
            >
              {getStatusText(enrollment.status)}
            </ThemedText>
          </View>
          <View className="flex-row justify-between items-end">
            <ThemedText
              className="text-primary font-semibold text-sm flex-shrink mr-2"
              numberOfLines={1}
            >
              {enrollment?.client?.user?.username ?? "Cliente..."}
            </ThemedText>
            <ThemedText className="text-muted-foreground font-light text-xs">
              {formatDate(enrollment.startDate)}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} className="mb-3">
      <View
        className={`w-full bg-card rounded-lg border-l-4 ${statusStyle.border} shadow-sm p-3`}
      >
        <View className="flex-row justify-between items-start mb-1">
          <ThemedText
            className="text-card-foreground font-semibold text-base flex-shrink mr-2"
            numberOfLines={1}
          >
            {enrollment.client?.user?.username ?? "Cliente não encontrado"}
          </ThemedText>
          <ThemedText
            className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyle.bg} ${statusStyle.text}`}
          >
            {getStatusText(enrollment.status)}
          </ThemedText>
        </View>

        <View className="flex-row justify-between items-center mb-1">
          <ThemedText className="text-sm text-muted-foreground">
            Preço: {formatCurrency(enrollment.price)}
          </ThemedText>
          <ThemedText className="text-xs text-muted-foreground">
            {formatDate(enrollment.startDate)} -{" "}
            {enrollment.endDate ? formatDate(enrollment.endDate) : "Atual"}
          </ThemedText>
        </View>

        <ThemedText
          className="text-xs text-muted-foreground mt-1"
          numberOfLines={1}
        >
          Serviço: {serviceSummary}
        </ThemedText>

        <ThemedText className="text-xs text-muted-foreground" numberOfLines={1}>
          Cobrança: {getChargeFrequencySummary(enrollment.chargeSchedule)}
        </ThemedText>
      </View>
    </Pressable>
  );
}
