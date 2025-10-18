import { CustomHeader } from "@/components/custom-header";
import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { FontPoppins } from "@/constants/font";
import { paymentMethodOptions } from "@/constants/service-payment-methods";
import { useThemeColor } from "@/hooks/use-theme-color";
import api from "@/services/api";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// Tipos para as abas de navegação
type Tab = "details" | "enrollments";

// Reutilizamos o tipo de dados do formulário de criação para garantir a consistência
type ServiceDetailFormData = {
  name: string;
  allowedPaymentMethods: string[];
  description?: string;
  isRecurrent?: boolean;
  hasFixedLocation?: boolean;
  address?: string;
  hasFixedPrice?: boolean;
  defaultPrice?: string;
  recurrence?: string;
};

// Opções de recorrência (extraídas do create.tsx)
const recurrenceOptions = [
  { label: "Mensalmente", value: "monthly" },
  { label: "Data do serviço", value: "service_date" },
  { label: "Personalizado", value: "custom" },
];

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const serviceId = Array.isArray(id) ? id[0] : id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("details"); // Estado para a aba ativa

  const { control, watch, reset } = useForm<ServiceDetailFormData>({
    defaultValues: {
      isRecurrent: false,
      hasFixedLocation: false,
      hasFixedPrice: false,
      allowedPaymentMethods: [],
      name: "",
      description: "",
      address: "",
      defaultPrice: "",
      recurrence: "",
    },
  });

  const cardColor = useThemeColor({}, "card");
  const iconColor = useThemeColor({}, "tint");
  const borderGrayColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const styles = useMemo(
    () =>
      getStyles({
        cardColor,
        iconColor,
        borderGrayColor,
        textColor,
        backgroundColor,
      }),
    [iconColor, borderGrayColor, cardColor, textColor, backgroundColor]
  );

  const isRecurrent = watch("isRecurrent");
  const hasFixedLocation = watch("hasFixedLocation");
  const hasFixedPrice = watch("hasFixedPrice");

  // Lógica de Carregamento de Dados e População do Formulário
  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        // Ajuste o endpoint se necessário
        const response = await api.get<Service>(`service/${serviceId}`);
        const service = response.data;

        // Mapeamento dos dados do serviço para o formato do formulário
        const formData: ServiceDetailFormData = {
          name: service.name || "",
          description: service.description || "",
          hasFixedLocation: !!service.address,
          address: service.address || "",
          hasFixedPrice: !!service.defaultPrice,
          defaultPrice: service.defaultPrice
            ? formatCurrency(service.defaultPrice || 0)
            : "",
          allowedPaymentMethods: service.allowedPaymentMethods || [],
        };

        reset(formData);
      } catch (err) {
        setError("Não foi possível carregar os detalhes do serviço.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, reset]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/(provider)/services");
    }
  };

  const handleEdit = () => {
    // Ação de Edição (Poderia navegar para uma tela de edição)
    alert("Iniciando edição do serviço.");
  };

  if (loading) {
    return (
      <ThemedView style={styles.pageContainer}>
        <CustomHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={iconColor} />
          <ThemedText color="background">
            Carregando detalhes do serviço...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.pageContainer}>
        <CustomHeader />
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: "red" }} color="background">
            {error}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const DetailsTab = (
    <View style={styles.cards}>
      <View style={styles.card}>
        <View style={styles.header}>
          <ThemedText style={[styles.cardTitle]} color="tint">
            Informações básicas
          </ThemedText>
        </View>
        <ControlledInput
          control={control}
          name="name"
          label="Nome"
          placeholder="Nome do Serviço"
          disabled={true}
        />
        <ControlledInput
          control={control}
          name="description"
          label="Descrição"
          placeholder="Descrição do Serviço"
          multiline
          numberOfLines={4}
          disabled={true}
        />
        <ControlledCheckbox
          control={control}
          name="isRecurrent"
          label="É um serviço recorrente?"
          disabled={true}
        />
      </View>

      {/* CARD 2: Localidade */}
      <View style={styles.card}>
        <View style={styles.header}>
          <ThemedText style={[styles.cardTitle]} color="tint">
            Localidade
          </ThemedText>
        </View>
        <ControlledCheckbox
          control={control}
          name="hasFixedLocation"
          label="Local fixo?"
          disabled={true}
        />
        {hasFixedLocation ? (
          <ControlledInput
            control={control}
            name="address"
            label="Endereço do local"
            placeholder="Nenhum endereço fixo"
            disabled={true}
          />
        ) : (
          <ThemedText style={styles.infoText} color="background">
            Serviço de localidade variável (não fixo).
          </ThemedText>
        )}
      </View>

      {/* CARD 3: Preços e Pagamento */}
      <View style={styles.card}>
        <View style={styles.header}>
          <ThemedText style={[styles.cardTitle]} color="tint">
            Preços e Pagamentos
          </ThemedText>
        </View>
        <ControlledCheckbox
          control={control}
          name="hasFixedPrice"
          label="Preço fixo?"
          disabled={true}
        />
        {hasFixedPrice ? (
          <ControlledInput
            control={control}
            name="defaultPrice"
            label="Preço (R$)"
            placeholder="Preço não definido"
            keyboardType="numeric"
            disabled={true}
          />
        ) : (
          <ThemedText style={styles.infoText} color="background">
            Preço é negociado ou variável.
          </ThemedText>
        )}

        <ControlledSelect
          control={control}
          name="allowedPaymentMethods"
          label="Métodos de pagamento permitidos"
          options={paymentMethodOptions}
          placeholder="Nenhum método selecionado"
          isMultiple
          disabled={true}
        />

        {isRecurrent && (
          <ControlledSelect
            control={control}
            name="recurrence"
            label="Recorrência do pagamento"
            options={recurrenceOptions}
            disabled={true}
          />
        )}
      </View>
    </View>
  );

  // Componente da Aba de Agendamentos (Enrollments)
  const EnrollmentsTab = (
    <View style={styles.cards}>
      <ThemedText style={styles.cardTitle} color="background">
        Agendamentos para {watch("name")}
      </ThemedText>
      {/* Você pode substituir este placeholder por uma lista de agendamentos reais */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardColor,
            minHeight: 150,
            justifyContent: "center",
          },
        ]}
      >
        <ThemedText color="background" style={{ opacity: 0.7 }}>
          Aqui seria a lista de todos os agendamentos (Enrollments) relacionados
          a este serviço.
        </ThemedText>
        <ThemedText color="background" style={{ marginTop: 10 }}>
          {/* Total de agendamentos: {router.params.enrollments?.length ?? 0} */}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.pageContainer}>
      <CustomHeader />
      <ScrollView
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {/* HEADER: Ícone de Voltar, Título e Botão de Edição */}
        <View style={styles.headerRow}>
          <View style={styles.titleGroup}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={textColor}
              onPress={handleBack}
            />
            <ThemedText style={styles.title} color="background">
              {watch("name") || "Detalhes do Serviço"}
            </ThemedText>
          </View>
          <Pressable onPress={handleEdit} style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color={cardColor} />
          </Pressable>
        </View>

        {/* TAB NAVIGATION */}
        <View style={styles.tabBarContainer}>
          <Button
            title="Detalhes"
            onPress={() => setActiveTab("details")}
            size="md"
            variant={activeTab === "details" ? "default" : "outline"}
            customColor={textColor}
            style={styles.tabButton}
          />
          <Button
            title="Agendamentos"
            onPress={() => setActiveTab("enrollments")}
            size="md"
            variant={activeTab === "enrollments" ? "default" : "outline"}
            customColor={textColor}
            style={styles.tabButton}
          />
        </View>

        {/* CONTEÚDO DA ABA */}
        {activeTab === "details" ? DetailsTab : EnrollmentsTab}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const getStyles = (colors: {
  cardColor: string;
  iconColor: string;
  borderGrayColor: string;
  textColor: string;
  backgroundColor: string;
}) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
    pageContainer: {
      flex: 1,
      flexGrow: 1,
      alignItems: "center",
      paddingTop: 20,
      width: "100%",
    },
    scrollContent: {
      alignItems: "center",
      width: "100%",
      paddingBottom: 80,
      gap: 20,
    },

    // HEADER ROW
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 20,
      marginTop: 20,
    },
    titleGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      flexShrink: 1,
    },
    title: {
      fontFamily: FontPoppins.SEMIBOLD,
      fontSize: 24,
      // flexShrink: 1, // Permite que o texto encolha
    },
    editButton: {
      padding: 8,
      borderRadius: 10,
      backgroundColor: colors.iconColor,
    },

    // TAB BAR STYLES
    tabBarContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      backgroundColor: colors.cardColor,
      borderBottomColor: colors.borderGrayColor,
    },
    tabButton: {
      flex: 1,
      marginHorizontal: 4,
    },
    cards: {
      width: "100%",
      gap: 20,
      paddingHorizontal: 20,
    },
    cardTitle: {
      fontSize: 16,
      fontFamily: FontPoppins.SEMIBOLD,
      marginBottom: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    card: {
      width: "100%",
      padding: 16,
      borderRadius: 12,
      justifyContent: "space-between",
      minHeight: 60,
      gap: 12,
      backgroundColor: colors.cardColor,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    infoText: {
      fontSize: 14,
      fontFamily: FontPoppins.MEDIUM,
      opacity: 0.7,
      paddingLeft: 4,
    },
  });
