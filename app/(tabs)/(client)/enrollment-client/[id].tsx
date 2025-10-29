import { ChargeDetailModal } from "@/components/enrollments/charge-detail-modal";
import { EnrollmentChargeTab } from "@/components/enrollments/enrollment-charge-tab";
import { EnrollmentDetailsTab } from "@/components/enrollments/enrollment-details-tab";
import { EnrollmentServiceTab } from "@/components/enrollments/enrollment-service-tab";
import {
  ServiceTabHeader,
  TabMeasurements,
} from "@/components/services/service-tab-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useToastStore } from "@/store/toastStore";
import { BILLING_MODEL } from "@/types/billing-model";
import { Charge } from "@/types/charge";
import { ENROLLMENT_STATUS } from "@/types/enrollment-status";
import { EnrollmentFormData, Enrollments } from "@/types/enrollments";
import { RECURRENCE_INTERVAL } from "@/types/recurrence-interval";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

export type TabKey = "details" | "charge" | "service";

export type TabConfig = {
  key: TabKey;
  title: string;
};

const tabs: TabConfig[] = [
  { key: "details", title: "Contrato" },
  { key: "charge", title: "Cobrança" },
  { key: "service", title: "Serviço" },
];

const defaultFormValues: EnrollmentFormData = {
  price: "R$ 0,00",
  startDate: format(new Date(), "dd/MM/yyyy"),
  endDate: undefined,
  status: ENROLLMENT_STATUS.ACTIVE,
  serviceId: "",
  clientId: "",
  chargeSchedule: {
    billingModel: BILLING_MODEL.RECURRING,
    recurrenceInterval: RECURRENCE_INTERVAL.MONTHLY,
    chargeDay: "1",
    dueDate: undefined,
  },
  serviceSchedule: {
    frequency: "WEEKLY",
    daysOfWeek: [],
    dayOfMonth: undefined,
    startTime: "09:00",
    endTime: "",
  },
};

export default function EnrollmentDetailScreen() {
  const { id, serviceId: serviceIdFromQuery } = useLocalSearchParams();
  const enrollmentId = Array.isArray(id) ? id[0] : id;
  const serviceIdParam = Array.isArray(serviceIdFromQuery)
    ? serviceIdFromQuery[0]
    : serviceIdFromQuery;

  const isCreating = enrollmentId === "new";

  const [enrollment, setEnrollment] = useState<Enrollments | null>(null);
  const [loading, setLoading] = useState(!isCreating);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("details");
  const [isEditing, setIsEditing] = useState(isCreating);
  const [initialServiceName, setInitialServiceName] = useState<
    string | undefined
  >();
  const { addToast } = useToastStore();
  const [tabMeasurements, setTabMeasurements] = useState<
    Record<TabKey, TabMeasurements | null>
  >({ details: null, charge: null, service: null });
  const indicatorTranslateX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);

  const handleChargePress = (charge: Charge) => {
    setSelectedCharge(charge);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCharge(null);
  };

  const { control, reset, getValues, handleSubmit, watch, setValue } =
    useForm<EnrollmentFormData>({
      defaultValues: {
        ...defaultFormValues,
        serviceId: serviceIdParam || "",
      },
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
      if (isEditing && !isCreating) return;
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
      isCreating,
    ]
  );

  useEffect(() => {
    setError(null);

    if (isCreating) {
      setIsEditing(true);
      setActiveTab("details");
    } else {
      setEnrollment(null);
      setInitialServiceName(undefined);
      setIsEditing(false);
      fetchEnrollment();
    }
  }, [enrollmentId]);

  const fetchEnrollment = useCallback(async () => {
    if (isCreating || !enrollmentId) {
      console.log("Skipping fetchEnrollment (isCreating or no ID)");
      return;
    }
    console.log("Fetching enrollment for ID:", enrollmentId);
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Enrollments>(
        `enrollments/${enrollmentId}`
      );
      const enrollmentData = response.data;
      setEnrollment(enrollmentData);
    } catch (err) {
      setError("Não foi possível carregar os detalhes do contrato.");
      console.error("Fetch enrollment error:", err);
      setEnrollment(null);
    } finally {
      setLoading(false);
    }
  }, [enrollmentId, isCreating]);

  useEffect(() => {
    if (isCreating && serviceIdParam && !initialServiceName) {
      const fetchInitialService = async () => {
        console.log("Fetching initial service for ID:", serviceIdParam);
        try {
          setLoading(true);
          const response = await api.get<Service>(`service/${serviceIdParam}`);
          const serviceData = response.data;
          setInitialServiceName(serviceData.name);
          if (
            serviceData.defaultPrice !== undefined &&
            serviceData.defaultPrice !== null
          ) {
            setValue("price", formatCurrency(serviceData.defaultPrice));
          }
          setValue("startDate", format(new Date(), "dd/MM/yyyy"));
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch initial service name", err);
          addToast("Não foi possível carregar dados do serviço.", "error");
          setError("Falha ao carregar serviço inicial.");
          setLoading(false);
        }
      };
      fetchInitialService();
    } else if (isCreating && !serviceIdParam && !watch("startDate")) {
      setValue("startDate", format(new Date(), "dd/MM/yyyy"));
    }
  }, [
    isCreating,
    serviceIdParam,
    setValue,
    addToast,
    initialServiceName,
    watch,
  ]);

  const handleBack = () => {
    router.replace(`/(tabs)/(client)/enrollments`);
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="text-tint" />
        <ThemedText className="text-foreground mt-2">
          {isCreating
            ? "Carregando dados iniciais..."
            : "Carregando detalhes do contrato..."}
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1 justify-center items-center p-5">
        <Ionicons
          name="alert-circle-outline"
          size={48}
          className="text-red-500 mb-4"
        />
        <ThemedText className="text-foreground text-center mb-4">
          {error}
        </ThemedText>
        <Button title={"Voltar"} onPress={handleBack} variant={"link"}></Button>
      </ThemedView>
    );
  }

  if (!isCreating && !enrollment) {
    return (
      <ThemedView className="flex-1 justify-center items-center p-5">
        <ThemedText className="text-foreground text-center mb-4">
          Contrato não encontrado.
        </ThemedText>
        <Button title="Voltar" onPress={handleBack} variant="link"></Button>
      </ThemedView>
    );
  }

  return (
    <View className="flex-1 w-full pt-5 bg-background">
      <View className="flex-row justify-between items-center w-full px-5 mt-5 mb-5">
        <View className="flex-row items-center gap-4 flex-1 mr-2">
          <Ionicons
            name="arrow-back"
            size={24}
            className={`text-foreground ${
              isEditing && !isCreating ? "opacity-30" : ""
            }`}
            onPress={handleBack}
            disabled={isEditing && !isCreating}
          />
          <ThemedText
            className="text-2xl font-semibold text-foreground flex-shrink"
            numberOfLines={1}
          >
            {isCreating
              ? "Novo Contrato"
              : enrollment?.client?.user?.username || "Detalhes do Contrato"}
          </ThemedText>
        </View>
      </View>
      <ServiceTabHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isEditing={isEditing && !isCreating}
        indicatorTranslateX={indicatorTranslateX}
        indicatorWidth={indicatorWidth}
        onTabLayout={onTabLayout}
      />
      <ScrollView
        key={isCreating ? `new-${serviceIdParam || "general"}` : enrollmentId}
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
                <EnrollmentDetailsTab
                  control={control}
                  isEditing={isEditing}
                  enrollment={enrollment}
                  initialServiceName={initialServiceName}
                  serviceIdFromQuery={serviceIdParam}
                />
              )}
              {tab.key === "charge" && (
                <EnrollmentChargeTab
                  control={control}
                  isEditing={isEditing}
                  enrollment={enrollment}
                  onChargePress={handleChargePress}
                />
              )}
              {tab.key === "service" && (
                <EnrollmentServiceTab
                  control={control}
                  isEditing={isEditing}
                  enrollment={enrollment}
                />
              )}
            </View>
          ))}
        </Animated.View>
        <View className="h-20" />
      </ScrollView>
      <ChargeDetailModal
        visible={isModalVisible}
        charge={selectedCharge}
        onClose={handleCloseModal}
      />
    </View>
  );
}
