import { ThemedView } from "@/components/themed-view";
import { FontPoppins } from "@/constants/font";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { useThemeColor } from "@/hooks/use-theme-color";
import api from "@/services/api";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/search-input";

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
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
  const cardColor = useThemeColor({}, "card");
  const iconColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "background");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOption, setSearchOption] = useState("all");

  const styles = useMemo(
    () => getStyles({ cardColor, iconColor, textColor }),
    [cardColor, iconColor, textColor]
  );

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
    <ThemedView style={[styles.card]}>
      <View style={styles.header}>
        <View>
          <ThemedText style={[styles.cardTitle]}>Meus Serviços</ThemedText>
          <ThemedText style={[styles.cardSubTitle]}>
            Gerencie seus serviços
          </ThemedText>
        </View>
        <Button onPress={handleNewService} title="+ Novo Serviço" size="md" />
      </View>

      <View style={styles.searchContainer}>
        <SearchInput
          placeholder="Buscar serviços..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.optionsSearch}>
          {optionsSearch.map((option) => (
            <Button
              variant={searchOption === option.value ? "default" : "outline"}
              key={option.value}
              title={option.label}
              onPress={() => handleSearchOptionChange(option.value)}
              size="xs"
              customColor={textColor}
            />
          ))}
        </View>
      </View>

      {/* O indicador de loading afeta APENAS o bloco da lista abaixo do input */}
      {loading ? (
        <View style={{ paddingVertical: 20 }}>
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
                <ThemedText
                  style={[
                    styles.cardSubTitle,
                    { textAlign: "center", marginTop: 20 },
                  ]}
                >
                  Nenhum serviço encontrado com a busca e filtros aplicados.
                </ThemedText>
              )}
            </>
          ) : (
            <ThemedText style={[styles.cardSubTitle]}>
              Nenhum serviço cadastrado
            </ThemedText>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const ServiceCard = ({ service }: { service: Service }) => {
  const cardColor = useThemeColor({}, "card");
  const iconColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "background");
  const borderGrayColor = useThemeColor({}, "border");

  const styles = useMemo(
    () => getStyles({ cardColor, iconColor, textColor, borderGrayColor }),
    [cardColor, iconColor, textColor, borderGrayColor]
  );

  const handleGoToService = () => {
    router.replace(`/services/${service.id}`);
  };

  return (
    <View style={styles.cardService}>
      <View style={styles.cardServiceHeader}>
        <Text style={styles.cardServiceTitle}>{service.name}</Text>
        <View style={styles.headerIcons}>
          <Ionicons
            style={styles.icon}
            name="eye-outline"
            size={18}
            color={textColor}
            onPress={handleGoToService}
          />
          <Ionicons
            style={styles.icon}
            name="ellipsis-horizontal-outline"
            size={18}
            color={textColor}
          />
        </View>
      </View>
      <View style={styles.serviceDataContainer}>
        <View style={styles.serviceData}>
          <Text style={styles.value}>
            R$ {formatCurrency(service.defaultPrice || 0)}
          </Text>
          <Text style={styles.textValue}>Valor por serviço</Text>
        </View>

        <View style={styles.serviceData}>
          <Text style={styles.value}>{service?.enrollments?.length || 0}</Text>
          <Text style={styles.textValue}>
            {service?.enrollments?.length === 1
              ? "agendamento"
              : "agendamentos"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: {
  cardColor: string;
  iconColor: string;
  textColor: string;
  borderGrayColor?: string;
}) =>
  StyleSheet.create({
    card: {
      width: "100%",
      padding: 14,
      borderRadius: 12,
      marginBottom: 16,
      justifyContent: "space-between",
      minHeight: 60,
      gap: 8,
      backgroundColor: colors.cardColor,
    },
    cardTitle: {
      fontSize: 16,
      fontFamily: FontPoppins.SEMIBOLD,
      color: colors.textColor,
    },
    cardSubTitle: {
      marginTop: -6,
      fontSize: 10,
      color: colors.textColor,
      fontFamily: FontPoppins.LIGHT,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    valueText: {
      fontSize: 18,
      fontFamily: FontPoppins.MEDIUM,
    },
    searchContainer: {
      gap: 10,
      marginBottom: 10,
    },
    optionsSearch: {
      flexDirection: "row",
      gap: 10,
    },
    cardService: {
      width: "100%",
      minHeight: 60,
      borderRadius: 8,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.iconColor,
      borderWidth: 1,
      borderColor: colors.borderGrayColor,
      paddingVertical: 6,
      paddingHorizontal: 10,
      justifyContent: "space-between",
    },
    cardServiceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cardServiceTitle: {
      fontSize: 12,
      color: colors.textColor,
      fontFamily: FontPoppins.MEDIUM,
    },
    headerIcons: {
      flexDirection: "row",
      gap: 16,
    },
    serviceDataContainer: {
      flexDirection: "row",
      gap: 64,
    },
    serviceData: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 10,
    },
    value: {
      color: colors.iconColor,
      fontFamily: FontPoppins.MEDIUM,
      fontSize: 13,
    },
    textValue: {
      color: colors.textColor,
      fontFamily: FontPoppins.LIGHT,
      fontSize: 10,
    },
    icon: {
      cursor: "pointer",
    },
  });
