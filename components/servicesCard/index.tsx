import { StripeOnboardingModal } from "@/app/onboarding/stripe";
import { useProviderServices } from "@/hooks/use-services";
import { useAuthStore } from "@/store/authStore";
import { isProviderRole } from "@/utils/user-role";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useDebounce } from "@/hooks/use-debounce";
import { ThemedText } from "../themed-text";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/search-input";

export function ServicesCard() {
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
    data: services = [],
    isLoading,
    error,
  } = useProviderServices({
    q: debouncedSearchQuery || undefined,
    isActive: isActiveFilter,
  });

  const optionsSearch = [
    { label: "Todos", value: "all" },
    { label: "Ativos", value: "actives" },
    { label: "Inativos", value: "inactives" },
  ];

  const handleNewService = () => {
    router.navigate("/(tabs)/(provider)/services/create");
  };

  const handleSearchOptionChange = (optionValue: string) => {
    setSearchOption(optionValue);
  };

  const { user } = useAuthStore();

  const segments = useSegments();

  if (error) {
    return (
      <View>
        <ThemedText>
          {error ? "Não foi possível carregar ou buscar os serviços." : "Dados indisponíveis."}
        </ThemedText>
      </View>
    );
  }

  const showServiceList =
    services.length > 0 || debouncedSearchQuery || searchOption !== "all";

  const isProvider = isProviderRole(user?.role);
  const providerStatus = user?.providerProfile?.status;

  const currentRouteName = segments[segments.length - 1];
  const isOnStripeConfiguredRoute = currentRouteName === "stripe-configured";
  const showOnboardingModal =
    isProvider && providerStatus !== "ACTIVE" && !isOnStripeConfiguredRoute;

  return (
    <>
      <StripeOnboardingModal visible={showOnboardingModal} />

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
          <Button onPress={handleNewService} title="+ Novo Serviço" size="md" />
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
            {showServiceList ? (
              <>
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
                {!services.length && (
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
    </>
  );
}

const ServiceCard = ({ service }: { service: Service }) => {
  const handleGoToService = () => {
    router.replace(`/services/${service.id}`);
  };

  return (
    <Pressable
      onPress={handleGoToService}
      className="w-full min-h-16  rounded-lg mb-2 border-l-4 border-l-primary border-2 border-slate-200 py-2.5 px-2.5 justify-between"
    >
      <View className="flex-row justify-between">
        <ThemedText className="text-card-foreground text-xs">
          {service.name}
        </ThemedText>
        <View className="flex-row gap-4">
          <Ionicons
            className="cursor-pointer text-card-foreground"
            name="eye-outline"
            size={18}
            onPress={handleGoToService}
          />
          {/* <Ionicons
            className="cursor-pointer text-card-foreground"
            name="ellipsis-horizontal-outline"
            size={18}
          /> */}
        </View>
      </View>
      <View className="flex-row gap-16">
        <View className="flex-row items-baseline gap-2.5">
          {service.defaultPrice ? (
            <>
              <Text className="text-primary font-medium text-xs">
                {formatCurrency(service.defaultPrice || 0)}
              </Text>
              <Text className="text-card-foreground font-light text-xs hidden md:flex">
                Valor por serviço
              </Text>
            </>
          ) : (
            <>
              <Text className="text-primary font-medium text-xs">Valor</Text>
              <Text className="text-card-foreground font-light text-xs hidden md:flex">
                a combinar com cliente
              </Text>
            </>
          )}
        </View>

        <View className="flex-row items-baseline gap-2.5">
          <Text className="text-primary font-medium text-xs">
            {service?.enrollments?.length || 0}
          </Text>
          <Text className="text-card-foreground font-light text-xs">
            {service?.enrollments?.length === 1 ? "contrato" : "contratos"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
