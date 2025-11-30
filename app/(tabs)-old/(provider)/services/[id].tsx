import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import api from "@/services/api";
import { useToastStore } from "@/store/toastStore";
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

import { ServiceDetailsTab } from "@/components/services/service-details-tab";
import { ServiceEnrollmentsTab } from "@/components/services/service-enrollments-tab";
import { ServiceOccurrencesTab } from "@/components/services/service-ocorreences-tab";
import {
  ServiceTabHeader,
  TabConfig,
  TabKey,
  TabMeasurements,
} from "@/components/services/service-tab-header";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PAYMENT_METHOD } from "@/types/payment-method";
import { parseCurrency } from "@/utils/parse-currency";

type ServiceDetailFormData = {
  name: string;
  allowedPaymentMethods: string[];
  description?: string;
  isRecurrent?: boolean;
  hasFixedLocation?: boolean;
  address?: string;
  hasFixedPrice?: boolean;
  defaultPrice?: string;
};

const { width: screenWidth } = Dimensions.get("window");

const tabs: TabConfig[] = [
  { key: "details", title: "Detalhes" },
  { key: "enrollments", title: "Contratos" },
  { key: "schedules", title: "Agendamentos" },
];

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const serviceId = Array.isArray(id) ? id[0] : id;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("details");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToastStore();

  const [tabMeasurements, setTabMeasurements] = useState<
    Record<TabKey, TabMeasurements | null>
  >({ details: null, enrollments: null, schedules: null });

  const indicatorTranslateX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);

  const { control, watch, reset, getValues, setValue } =
    useForm<ServiceDetailFormData>({
      defaultValues: {
        isRecurrent: false,
        hasFixedLocation: false,
        hasFixedPrice: false,
        allowedPaymentMethods: [],
        name: "",
        description: "",
        address: "",
        defaultPrice: "",
      },
    });

  const isRecurrent = watch("isRecurrent");
  const hasFixedLocation = watch("hasFixedLocation");
  const hasFixedPrice = watch("hasFixedPrice");

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
    (tabKey: TabKey) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      setTabMeasurements((prev) => {
        const newMeasurements = {
          ...prev,
          [tabKey]: { x, width },
        };

        if (tabKey === activeTab && prev[activeTab] === null) {
          const firstTabKey = tabs[0].key;
          if (newMeasurements[firstTabKey]) {
            indicatorWidth.value = newMeasurements[firstTabKey]!.width;
            indicatorTranslateX.value = newMeasurements[firstTabKey]!.x;
          }
        }
        return newMeasurements;
      });
    },
    [indicatorTranslateX, indicatorWidth, activeTab]
  );

  const handleTabChange = useCallback(
    (tabKey: TabKey) => {
      if (isEditing) return;
      setActiveTab(tabKey);

      const measurements = tabMeasurements[tabKey];
      if (measurements) {
        indicatorWidth.value = measurements.width;
        indicatorTranslateX.value = measurements.x;
      }

      const tabIndex = tabs.findIndex((tab) => tab.key === tabKey);
      contentTranslateX.value = -screenWidth * tabIndex;
    },
    [
      tabMeasurements,
      indicatorTranslateX,
      indicatorWidth,
      contentTranslateX,
      isEditing,
    ]
  );

  const resetFormFromService = useCallback(
    (serviceToReset: Service | null) => {
      if (!serviceToReset) {
        reset({
          isRecurrent: false,
          hasFixedLocation: false,
          hasFixedPrice: false,
          allowedPaymentMethods: [],
          name: "",
          description: "",
          address: "",
          defaultPrice: "",
        });
        return;
      }
      const formData: ServiceDetailFormData = {
        name: serviceToReset.name || "",
        description: serviceToReset.description || "",
        isRecurrent: serviceToReset.isRecurrent ?? false,
        hasFixedLocation: !!serviceToReset.address,
        address: serviceToReset.address || "",
        hasFixedPrice:
          serviceToReset.defaultPrice !== null &&
          serviceToReset.defaultPrice !== undefined,
        defaultPrice:
          serviceToReset.defaultPrice !== null &&
          serviceToReset.defaultPrice !== undefined
            ? formatCurrency(serviceToReset.defaultPrice)
            : "",
        allowedPaymentMethods: serviceToReset.allowedPaymentMethods || [],
      };
      reset(formData);
    },
    [reset]
  );

  const fetchService = useCallback(async () => {
    if (!serviceId) {
      setError("ID do serviço não encontrado.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Service>(`service/${serviceId}`);
      const serviceData = response.data;
      setService(serviceData);
      resetFormFromService(serviceData);
    } catch (err) {
      setError("Não foi possível carregar os detalhes do serviço.");
      console.error("Fetch service error:", err);
      setService(null);
      resetFormFromService(null);
    } finally {
      setLoading(false);
    }
  }, [serviceId, resetFormFromService]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleBack = () => {
    if (isEditing) return;
    router.replace("/(tabs)/(provider)/services");
  };

  const handleEdit = () => {
    if (!service) return;
    addToast(`Editando ${service.name}`, "warning");
    setIsEditing(true);
    handleTabChange("details");
  };

  const handleCancelEdit = () => {
    if (service) {
      addToast(`Cancelando edição de ${service.name}`, "warning");
      resetFormFromService(service);
    }
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!serviceId) return;
    setIsSubmitting(true);
    try {
      const formData = getValues();

      const priceAsNumber =
        formData.hasFixedPrice && formData.defaultPrice
          ? parseCurrency(formData.defaultPrice)
          : undefined;

      if (formData.hasFixedPrice && isNaN(priceAsNumber ?? NaN)) {
        addToast("Preço padrão inválido.", "error");
        setIsSubmitting(false);
        return;
      }
      const updateDto: Partial<Service> = {
        name: formData.name,
        description: formData.description,
        address: formData.hasFixedLocation ? formData.address : undefined,
        defaultPrice: priceAsNumber,
        allowedPaymentMethods:
          formData.allowedPaymentMethods as PAYMENT_METHOD[],
        isRecurrent: formData.isRecurrent,
      };

      Object.keys(updateDto).forEach(
        (key) =>
          updateDto[key as keyof typeof updateDto] === undefined &&
          delete updateDto[key as keyof typeof updateDto]
      );

      const response = await api.patch<Service>(
        `service/${serviceId}`,
        updateDto
      );

      addToast(`${formData.name} editado com sucesso`, "success");

      const updatedService = response.data;
      setService(updatedService);
      resetFormFromService(updatedService);
      setIsEditing(false);
    } catch (err: any) {
      console.error(
        "Failed to update service:",
        err?.response?.data || err?.message || err
      );
      addToast(
        `Não foi possível salvar: ${
          err?.response?.data?.message || "Erro desconhecido"
        }`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const enrollments = useMemo(
    () => service?.enrollments,
    [service?.enrollments]
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 p-4">
        <SkeletonCard showHeader={true} showFooter={false} lines={5} />
      </ThemedView>
    );
  }

  if (error && !service) {
    return (
      <ErrorState
        title="Erro ao carregar serviço"
        message={error || "Não foi possível carregar os detalhes do serviço."}
        onRetry={() => fetchService()}
        retryLabel="Tentar novamente"
      />
    );
  }

  if (!service) {
    return (
      <ErrorState
        title="Serviço não encontrado"
        message="O serviço solicitado não foi encontrado."
        onRetry={handleBack}
        retryLabel="Voltar"
      />
    );
  }

  return (
    <View className="flex-1 w-full md:pt-5 bg-background">
      <View className="flex-row justify-between items-center w-full px-5 mt-5 mb-2">
        <View className="flex-row items-center gap-4 flex-1 mr-2">
          <Ionicons
            name="arrow-back"
            size={24}
            className={`text-foreground ${isEditing ? "opacity-30" : ""}`}
            onPress={handleBack}
            disabled={isEditing}
          />
          <ThemedText
            className="md:text-2xl font-semibold text-foreground flex-shrink"
            numberOfLines={1}
          >
            {watch("name") || "Detalhes do Serviço"}
          </ThemedText>
        </View>

        {isEditing ? (
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleCancelEdit}
              disabled={isSubmitting}
              className="w-10 h-10 p-2 rounded-full bg-muted items-center justify-center"
            >
              <Ionicons
                name="close-outline"
                size={24}
                className="text-muted-foreground"
              />
            </Pressable>
            <Pressable
              onPress={handleSaveEdit}
              disabled={isSubmitting}
              className={`w-10 h-10 p-2 rounded-full items-center justify-center ${
                isSubmitting ? "bg-primary/70" : "bg-primary"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name="save"
                  size={22}
                  className="text-primary-foreground"
                />
              )}
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleEdit}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          >
            <Ionicons
              name="create-outline"
              size={22}
              className="text-primary-foreground"
            />
          </Pressable>
        )}
      </View>
      <ServiceTabHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isEditing={isEditing}
        indicatorTranslateX={indicatorTranslateX}
        indicatorWidth={indicatorWidth}
        onTabLayout={onTabLayout}
      />

      <ScrollView
        key={activeTab}
        className="w-full flex-1 mt-5"
        contentContainerStyle={{ alignItems: "flex-start" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            {
              flexDirection: "row",
              width: screenWidth * tabs.length,
            },
            contentAnimatedStyle,
          ]}
        >
          {tabs.map((tab) => (
            <View style={{ width: screenWidth }} key={tab.key}>
              {tab.key === "details" && (
                <ServiceDetailsTab
                  control={control}
                  isEditing={isEditing}
                  service={service}
                  hasFixedLocation={hasFixedLocation}
                  hasFixedPrice={hasFixedPrice}
                  isRecurrent={isRecurrent}
                />
              )}
              {tab.key === "enrollments" && (
                <ServiceEnrollmentsTab
                  enrollments={enrollments}
                  serviceId={serviceId}
                />
              )}
              {tab.key === "schedules" && (
                <ServiceOccurrencesTab serviceId={serviceId} />
              )}
            </View>
          ))}
        </Animated.View>
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
