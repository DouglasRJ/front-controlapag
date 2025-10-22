import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { paymentMethodOptions } from "@/constants/service-payment-methods";
import api from "@/services/api";
import { Enrollments } from "@/types/enrollments";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Tab = "details" | "enrollments";

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

const recurrenceOptions = [
  { label: "Mensalmente", value: "monthly" },
  { label: "Data do serviço", value: "service_date" },
  { label: "Personalizado", value: "custom" },
];

type TabMeasurements = {
  x: number;
  width: number;
};

const { width: screenWidth } = Dimensions.get("window");
const tabIndicatorPadding = 1;

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const serviceId = Array.isArray(id) ? id[0] : id;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [tabMeasurements, setTabMeasurements] = useState<
    Record<Tab, TabMeasurements | null>
  >({ details: null, enrollments: null });

  const indicatorTranslateX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);

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

  const isRecurrent = watch("isRecurrent");
  const hasFixedLocation = watch("hasFixedLocation");
  const hasFixedPrice = watch("hasFixedPrice");

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(indicatorWidth.value, {
        damping: 15,
        stiffness: 120,
      }),
      transform: [
        {
          translateX: withSpring(indicatorTranslateX.value, {
            damping: 15,
            stiffness: 120,
          }),
        },
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(contentTranslateX.value, {
            damping: 18,
            stiffness: 120,
          }),
        },
      ],
    };
  });

  const onTabLayout = useCallback(
    (tabKey: Tab) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      setTabMeasurements((prev) => {
        const newMeasurements = {
          ...prev,
          [tabKey]: { x, width },
        };

        if (tabKey === "details" && prev.details === null) {
          indicatorWidth.value = width - tabIndicatorPadding * 2;
          indicatorTranslateX.value = x + tabIndicatorPadding;
        }
        return newMeasurements;
      });
    },
    [indicatorTranslateX, indicatorWidth]
  );

  const handleTabChange = useCallback(
    (tabKey: Tab) => {
      setActiveTab(tabKey);
      const measurements = tabMeasurements[tabKey];
      if (measurements) {
        indicatorWidth.value = measurements.width - tabIndicatorPadding * 2;
        indicatorTranslateX.value = measurements.x + tabIndicatorPadding;
      }

      if (tabKey === "details") {
        contentTranslateX.value = 0;
      } else {
        contentTranslateX.value = -screenWidth;
      }
    },
    [tabMeasurements, indicatorTranslateX, indicatorWidth, contentTranslateX]
  );

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await api.get<Service>(`service/${serviceId}`);
      const service = response.data;
      setService(service);
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

  useEffect(() => {
    if (!serviceId) return;

    fetchService();
  }, [serviceId, reset]);

  const handleBack = () => {
    router.replace("/(tabs)/(provider)/services");
  };

  const handleEdit = () => {
    alert("Iniciando edição do serviço.");
  };

  const enrollments = useMemo(
    () => service?.enrollments,
    [service?.enrollments]
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 w-full items-center pt-5">
        <View className="flex-1 justify-center items-center mt-12">
          <ActivityIndicator size="large" color="text-tint" />
          <ThemedText className="text-foreground mt-2">
            Carregando detalhes do serviço...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1 w-full items-center pt-5">
        <View className="flex-1 justify-center items-center mt-12">
          <ThemedText className="text-foreground">{error}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const DetailsTab = (
    <View className="w-full gap-5 px-5">
      <View className="w-full p-4 rounded-xl justify-between min-h-[60px]  bg-card shadow-sm">
        <View className="flex-row items-center justify-between">
          <ThemedText className="text-card-foreground font-semibold mb-2">
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

      <View className="w-full p-4 rounded-xl justify-between min-h-[60px] gap-3 bg-card shadow-sm">
        <View className="flex-row items-center justify-between">
          <ThemedText className="text-base font-semibold mb-2 text-card-foreground">
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
          <ThemedText className="text-sm font-medium opacity-70 pl-1 text-card-foreground">
            Serviço de localidade variável (não fixo).
          </ThemedText>
        )}
      </View>

      <View className="w-full p-4 rounded-xl justify-between min-h-[60px] gap-3 bg-card shadow-sm">
        <View className="flex-row items-center justify-between">
          <ThemedText className="text-base font-semibold mb-2 text-card-foreground">
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
          <ThemedText className="text-sm font-medium opacity-70 pl-1 text-card-foreground">
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

  const EnrollmentsTab = (
    <View className="w-full gap-5 px-5">
      <View className="w-full p-4 rounded-xl justify-center min-h-[150px] gap-3 bg-card shadow-sm">
        <View className="flex-row items-center justify-between">
          <ThemedText className="text-base font-semibold mb-2 text-card-foreground">
            Agendamentos para {service?.name ?? "o serviço"}
          </ThemedText>
        </View>
        {enrollments?.length && service ? (
          enrollments.map((enrollment) => (
            <ServiceCard
              key={enrollment.id}
              enrollment={enrollment}
              serviceName={service.name}
            />
          ))
        ) : (
          <ThemedText className="text-xs text-card-foreground font-light text-center py-8">
            Nenhum agendamento para esse serviço
          </ThemedText>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 w-full items-center pt-5 bg-background">
      <ScrollView
        className="w-full flex-1"
        contentContainerStyle={{
          alignItems: "center",
          width: "100%",
          paddingBottom: 80,
          gap: 20,
        }}
        showsHorizontalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center w-full px-5 mt-5">
          <View className="flex-row items-center gap-4 shrink">
            <Ionicons
              name="arrow-back"
              size={24}
              className="text-foreground"
              onPress={handleBack}
            />
            <ThemedText className="text-2xl font-semibold text-foreground">
              {watch("name") || "Detalhes do Serviço"}
            </ThemedText>
          </View>
          <Pressable
            onPress={handleEdit}
            className="relative w-10 h-10 p-2 rounded-full bg-primary"
          >
            <Ionicons
              name="create-outline"
              size={24}
              className="top-1.5 right-1.5 text-foreground absolute"
            />
          </Pressable>
        </View>

        <View className="w-full px-5">
          <View className="relative flex-row rounded-full border border-icon">
            <Animated.View
              className="absolute top-0 w-full h-full rounded-full bg-primary"
              style={[indicatorAnimatedStyle]}
            />

            {[
              { key: "details" as Tab, title: "Detalhes" },
              { key: "enrollments" as Tab, title: "Agendamentos" },
            ].map(({ key, title }) => {
              const isActive = activeTab === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => handleTabChange(key)}
                  onLayout={onTabLayout(key)}
                  className="flex-1 items-center justify-center p-2 z-10"
                >
                  <ThemedText
                    className={`text-sm font-semibold transition-colors duration-300 w-28  ${
                      isActive ? "text-card" : "text-foreground"
                    }`}
                  >
                    {title}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <Animated.View
            style={[
              {
                flexDirection: "row",
                width: screenWidth * 2,
              },
              contentAnimatedStyle,
            ]}
          >
            <View style={{ width: screenWidth }}>{DetailsTab}</View>
            <View style={{ width: screenWidth }}>{EnrollmentsTab}</View>
          </Animated.View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}

const ServiceCard = ({
  enrollment,
  serviceName,
}: {
  enrollment: Enrollments;
  serviceName: string;
}) => {
  return (
    <View className="pr-4 w-full min-h-16  rounded-lg mb-2 border-l-4 border-l-primary border-2 border-slate-200 py-2.5 px-2.5 justify-between">
      <View className="flex-row justify-between">
        <ThemedText className="text-card-foreground text-xs">
          {enrollment.startDate.toString()}
        </ThemedText>
        <ThemedText className="text-card-foreground font-light text-xs">
          {serviceName}
        </ThemedText>
      </View>
      <View className="flex-row gap-16">
        <View className="flex-row items-baseline gap-2.5">
          <ThemedText className="text-primary font-medium text-xs">
            {enrollment?.client?.user?.username}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
