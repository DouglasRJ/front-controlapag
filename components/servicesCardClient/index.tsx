import { useClientEnrollments } from "@/hooks/use-enrollments";
import { useDebounce } from "@/hooks/use-debounce";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { ENROLLMENT_STATUS } from "@/types/enrollment-status";
import { Enrollments } from "@/types/enrollments";
import { formatCurrency } from "@/utils/format-currency";
import { isAfter, startOfToday } from "date-fns";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/search-input";

export function EnrollmentsCardClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOption, setSearchOption] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  let isActiveFilter: boolean | undefined;
  if (searchOption === "actives") {
    isActiveFilter = true;
  } else if (searchOption === "inactives") {
    isActiveFilter = false;
  }

  const {
    data: enrollments = [],
    isLoading,
    error,
  } = useClientEnrollments({
    q: debouncedSearchQuery || undefined,
    isActive: isActiveFilter,
  });

  const optionsSearch = [
    { label: "Todos", value: "all" },
    { label: "Ativos", value: "actives" },
    { label: "Inativos", value: "inactives" },
  ];

  const handleNewEnrollment = () => {
    router.navigate("/(tabs)/(provider)/enrollments/create");
  };

  const handleSearchOptionChange = (optionValue: string) => {
    setSearchOption(optionValue);
  };

  if (error) {
    return (
      <View>
        <ThemedText>
          {error ? "Não foi possível carregar ou buscar os serviços." : "Dados indisponíveis."}
        </ThemedText>
      </View>
    );
  }

  const showEnrollmentList =
    enrollments.length > 0 || debouncedSearchQuery || searchOption !== "all";

  return (
    <View className="bg-card w-full p-3 justify-between min-h-16 gap-2 rounded-lg">
      <View className="flex-row items-center justify-between">
        <View>
          <ThemedText className="font-semibold text-card-foreground">
            Meus Serviços
          </ThemedText>
          <ThemedText className="-mb-1.5 text-xs text-card-foreground font-light">
            Gerencie seus serviços
          </ThemedText>
        </View>
      </View>

      <View className="gap-3 mb-3">
        <SearchInput
          placeholder="Buscar serviços..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View className="flex-row gap-3">
          {optionsSearch.map((option) => (
            <Button
              variant={searchOption === option.value ? "default" : "outline"}
              key={option.value}
              title={option.label}
              onPress={() => handleSearchOptionChange(option.value)}
              size="xs"
            />
          ))}
        </View>
      </View>

      {isLoading ? (
        <View className="py-3">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View>
          {showEnrollmentList ? (
            <>
              {enrollments.map((enrollment) =>
                enrollment.service ? (
                  <ServiceCard key={enrollment.id} enrollment={enrollment} />
                ) : null
              )}
              {!enrollments.length && (
                <ThemedText className="text-xs text-card-foreground font-light text-center py-8">
                  Nenhum serviço encontrado com a busca e filtros aplicados.
                </ThemedText>
              )}
            </>
          ) : (
            <ThemedText className="text-xs text-card-foreground font-light text-center py-8">
              Nenhum serviço cadastrado
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
}

const ServiceCard = ({ enrollment }: { enrollment: Enrollments }) => {
  const service = enrollment.service!;
  const paymentStatus = getPaymentStatus(enrollment);

  const handleGoToEnrollment = () => {
    router.replace(`/enrollment-client/${enrollment.id}`);
  };

  return (
    <Pressable
      onPress={handleGoToEnrollment}
      className="w-full min-h-16  rounded-lg mb-2 border-l-4 border-l-primary border-2 border-slate-200 py-2.5 px-2.5 justify-between"
    >
      <View className="flex-row justify-between">
        <View className="flex-row items-baseline gap-2.5">
          <ThemedText className="text-card-foreground text-xs">
            {service.name}
          </ThemedText>
        </View>
        <View className="flex-row gap-4">
          <ThemedText
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${paymentStatus.bg} ${paymentStatus.textStyle}`}
          >
            {paymentStatus.text}
          </ThemedText>
        </View>
      </View>
      <View className="flex-row gap-16">
        <View className="flex-row items-baseline gap-2.5">
          <Text className="text-primary font-medium text-xs">
            {formatCurrency(enrollment.price || 0)}
          </Text>
          <Text className="text-card-foreground font-light text-xs hidden md:flex">
            Valor do serviço
          </Text>
        </View>
      </View>
    </Pressable>
  );
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
      bg: "bg-red-100 ",
      textStyle: "text-red-700 ",
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
    textStyle: "text-light",
  };
};
