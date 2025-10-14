import { ThemedView } from "@/components/themed-view";
import { FontPoppins } from "@/constants/font";
import { useAuthHydration } from "@/hooks/use-auth-hydration";
import { useThemeColor } from "@/hooks/use-theme-color";
import api from "@/services/api";
import { Enrollments } from "@/types/enrollments";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";

export function EnrollmentsCard() {
  const cardColor = useThemeColor({}, "card");
  const iconColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "background");
  const [enrollments, setEnrollments] = useState<Enrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const response = await api.get<Enrollments[]>("/provider/enrollments");
        setEnrollments(response.data);
      } catch (err) {
        setError("Não foi possível carregar as métricas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isHydrated]);

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
          <ThemedText style={[styles.cardTitle]}>
            Agendamentos de Hoje
          </ThemedText>
          <ThemedText style={[styles.cardSubTitle]}>
            Próximos compromissos
          </ThemedText>
        </View>
      </View>
      <View>
        {enrollments.length ? (
          enrollments.map((enrollment) => (
            <ServiceCard key={enrollment.id} enrollment={enrollment} />
          ))
        ) : (
          <ThemedText style={[styles.cardSubTitle]}>
            Nenhum agendamento para hoje
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const ServiceCard = ({ enrollment }: { enrollment: Enrollments }) => {
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
        <Text style={styles.cardServiceTitle}>
          {enrollment.startDate.toString()}
        </Text>
      </View>
      <View style={styles.serviceDataContainer}>
        <View style={styles.serviceData}>
          <Text style={styles.textValue}>
            {enrollment?.client?.user?.username}
          </Text>
        </View>
      </View>
      <View style={styles.serviceData}>
        <Text style={styles.textValue}>{enrollment?.service?.name}</Text>
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
