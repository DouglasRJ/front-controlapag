import { ThemedText } from "@/components/themed-text";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { ENROLLMENT_STATUS } from "@/types/enrollment-status";
import { Enrollments } from "@/types/enrollments";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { getChargeFrequencySummary } from "@/utils/get-charge-frequency-summary";
import { getServiceFrequencySummary } from "@/utils/get-service-frequency-sumary";
import { isAfter, startOfToday } from "date-fns";
import { router, useSegments } from "expo-router";
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

type PaymentStatus = {
  text: string;
  bg: string;
  textStyle: string;
};

const getPaymentStatus = (enrollment: Enrollments): PaymentStatus => {
  if (enrollment.status !== ENROLLMENT_STATUS.ACTIVE) {
    return {
      text: getStatusText(enrollment.status),
      bg: "bg-primary",
      textStyle: "text-light",
    };
  }

  const charges = enrollment.charges;
  if (!charges || charges.length === 0) {
    return {
      text: "Aguardando 1ª Cobrança",
      bg: "bg-primary",
      textStyle: "text-light",
    };
  }

  const today = startOfToday();
  let pendingCharge: Charge | null = null;
  let isOverdue = false;

  const sortedCharges = [...charges].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  for (const charge of sortedCharges) {
    if (
      charge.status === CHARGE_STATUS.PENDING ||
      charge.status === CHARGE_STATUS.OVERDUE
    ) {
      pendingCharge = charge;
      if (isAfter(today, new Date(charge.dueDate))) {
        isOverdue = true;
      }
      break;
    }
  }

  if (isOverdue) {
    return {
      text: "Atrasado",
      bg: "bg-red-100 dark:bg-red-900",
      textStyle: "text-red-700 dark:text-red-300",
    };
  }

  if (pendingCharge) {
    return {
      text: "Atrasado",
      bg: "bg-red-100 ",
      textStyle: "text-red-700 ",
    };
  }

  return {
    text: "Pago",
    bg: "bg-primary",
    textStyle: "text-white",
  };
};

export function EnrollmentCard({
  enrollment,
  size = "large",
}: EnrollmentCardProps) {
  const statusStyle = getStatusStyle(enrollment.status);
  const paymentStatus = getPaymentStatus(enrollment);
  const segments = useSegments();
  const handlePress = () => {
    if (!enrollment.id) {
      console.warn("Enrollment ID is missing, cannot navigate");
      return;
    }
    const serviceIdParam = enrollment.service?.id ? `?serviceId=${enrollment.service.id}` : "";
    router.push(`/(tabs)/(provider)/enrollments/${enrollment.id}${serviceIdParam}`);
  };

  const serviceSummary = getServiceScheduleSummaryText(enrollment);

  if (size === "small") {
    return (
      <Pressable onPress={handlePress} className="mb-2">
        <View
          className={`pr-4 w-full min-h-16 rounded-lg border-l-4 ${statusStyle.border} border-2 border-slate-200 bg-card py-2.5 px-2.5 justify-between`}
        >
          <View className="flex-row justify-between  mb-1">
            <ThemedText
              className="text-card-foreground text-xs font-medium flex-shrink mr-2"
              numberOfLines={1}
            >
              {enrollment?.service?.name ?? "Serviço Indefinido"}
            </ThemedText>
            <View className="gap-2 items-end">
              <ThemedText
                className={`text-xs font-medium px-1.5 py-0.5 rounded ${statusStyle.bg} ${statusStyle.text}`}
              >
                {getStatusText(enrollment.status)}
              </ThemedText>
              <ThemedText
                className={`text-xs font-medium px-1.5 py-0.5 rounded ${paymentStatus.bg} ${paymentStatus.textStyle}`}
              >
                {paymentStatus.text}
              </ThemedText>
            </View>
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
          <View className="gap-2 items-end">
            <ThemedText
              className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyle.bg} ${statusStyle.text}`}
            >
              {getStatusText(enrollment.status)}
            </ThemedText>
            <ThemedText
              className={`text-xs font-medium px-2 py-0.5 rounded ${paymentStatus.bg} ${paymentStatus.textStyle}`}
            >
              Pagamento: {paymentStatus.text}
            </ThemedText>
          </View>
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
