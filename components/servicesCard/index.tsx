import { useAuthHydration } from "@/hooks/use-auth-hydration";
import api from "@/services/api";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/search-input";

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: number;
  const debounced = (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
  (debounced as any).cancel = () => clearTimeout(timeoutId);
  return debounced;
};

export function ServicesCard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOption, setSearchOption] = useState("all");

  const isHydrated = useAuthHydration();

  const fetchServices = useCallback(
    async (query: string, status: string) => {
      if (!isHydrated) return;

      try {
        setLoading(true);
        setError(null);

        let isActiveFilter: boolean | undefined;
        if (status === "actives") {
          isActiveFilter = true;
        } else if (status === "inactives") {
          isActiveFilter = false;
        }

        const params = {
          q: query || undefined,
          isActive: isActiveFilter !== undefined ? isActiveFilter : undefined,
        };

        const response = await api.get<Service[]>("/provider/services", {
          params,
        });

        setServices(response.data);
      } catch (err) {
        setError("Não foi possível carregar ou buscar os serviços.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [isHydrated]
  );

  const debouncedFetchServices = useCallback(
    debounce((query, status) => fetchServices(query, status), 500),
    [fetchServices]
  );

  useEffect(() => {
    if (!isHydrated) return;

    if (searchQuery) {
      debouncedFetchServices(searchQuery, searchOption);
    } else {
      fetchServices(searchQuery, searchOption);
    }

    return () => {
      (debouncedFetchServices as any).cancel();
    };
  }, [
    isHydrated,
    searchQuery,
    searchOption,
    fetchServices,
    debouncedFetchServices,
  ]);

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

  if (error) {
    return (
      <View>
        <ThemedText>{error || "Dados indisponíveis."}</ThemedText>
      </View>
    );
  }

  const showServiceList =
    services.length > 0 || searchQuery || searchOption !== "all";

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

      {loading ? (
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
  );
}

const ServiceCard = ({ service }: { service: Service }) => {
  const handleGoToService = () => {
    router.replace(`/services/${service.id}`);
  };

  return (
    <View className="w-full min-h-16  rounded-lg mb-2 border-l-4 border-l-primary border-2 border-slate-200 py-2.5 px-2.5 justify-between">
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
          <Ionicons
            className="cursor-pointer text-card-foreground"
            name="ellipsis-horizontal-outline"
            size={18}
          />
        </View>
      </View>
      <View className="flex-row gap-16">
        <View className="flex-row items-baseline gap-2.5">
          <Text className="text-primary font-medium text-xs">
            R$ {formatCurrency(service.defaultPrice || 0)}
          </Text>
          <Text className="text-card-foreground font-light text-xs">
            Valor por serviço
          </Text>
        </View>

        <View className="flex-row items-baseline gap-2.5">
          <Text className="text-primary font-medium text-xs">
            {service?.enrollments?.length || 0}
          </Text>
          <Text className="text-card-foreground font-light text-xs">
            {service?.enrollments?.length === 1
              ? "agendamento"
              : "agendamentos"}
          </Text>
        </View>
      </View>
    </View>
  );
};
