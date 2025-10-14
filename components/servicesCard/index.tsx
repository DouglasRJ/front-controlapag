import { ThemedView } from "@/components/themed-view";
import { FontPoppins } from "@/constants/font";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { useThemeColor } from "@/hooks/use-theme-color";
import api from "@/services/api";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/search-input";

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

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await api.get<Service[]>("/provider/services");
        setServices(response.data);
      } catch (err) {
        setError("Não foi possível carregar as métricas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isHydrated]);

  const optionsSearch = [
    { label: "Todos", value: "all" },
    { label: "Ativos", value: "actives" },
    { label: "Inativos", value: "inactives" },
  ];

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <ThemedText>{error || "Dados indisponíveis."}</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={[styles.card]}>
      <View style={styles.header}>
        <View>
          <ThemedText style={[styles.cardTitle]}>Meus Serviços</ThemedText>
          <ThemedText style={[styles.cardSubTitle]}>
            Gerencie seus serviços
          </ThemedText>
        </View>
        <Button title="+ Novo Serviço" size="md" />
      </View>
      {services.length ? (
        <>
          <View style={styles.searchContainer}>
            <SearchInput
              placeholder="Buscar serviços..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={styles.optionsSearch}>
              {optionsSearch.map((option) => (
                <Button
                  variant={
                    searchOption === option.value ? "default" : "outline"
                  }
                  key={option.value}
                  title={option.label}
                  onPress={() => setSearchOption(option.value)}
                  size="xs"
                  customColor={textColor}
                />
              ))}
            </View>
          </View>
          <View>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        </>
      ) : (
        <ThemedText style={[styles.cardSubTitle]}>
          Nenhum serviço cadastrado
        </ThemedText>
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

  return (
    <View style={styles.cardService}>
      <View style={styles.cardServiceHeader}>
        <Text style={styles.cardServiceTitle}>{service.name}</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="eye-outline" size={18} color={textColor} />
          <Ionicons
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
          <Text style={styles.value}>{service?.enrollments?.length}</Text>
          <Text style={styles.textValue}>
            {service?.enrollments?.length > 1 ? "agendamentos" : "agendamento"}
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
  });
