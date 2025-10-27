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
import {
  CreateChargeScheduleDto,
  CreateEnrollmentDto,
  CreateServiceScheduleDto,
  EnrollmentFormData,
  Enrollments,
} from "@/types/enrollments";
import { RECURRENCE_INTERVAL } from "@/types/recurrence-interval";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format-currency";
import { parseCurrency } from "@/utils/parse-currency";
import { Ionicons } from "@expo/vector-icons";
import { format, isDate, isValid, parse } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

const parseInputDateString = (
  dateString: string | undefined | null
): Date | null => {
  if (
    !dateString ||
    typeof dateString !== "string" ||
    !dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)
  ) {
    return null;
  }
  try {
    const parsed = parse(dateString, "dd/MM/yyyy", new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const formatToISODateString = (
  date: Date | undefined | null
): string | undefined => {
  if (date && isDate(date) && isValid(date)) {
    return format(date, "yyyy-MM-dd");
  }
  return undefined;
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const resetFormFromEnrollment = useCallback(
    (enrollmentData: Enrollments | null) => {
      if (!enrollmentData) {
        console.log("Resetting form to default values.");
        reset({
          ...defaultFormValues,
          serviceId: serviceIdParam || "",
        });
        setEnrollment(null);
        setInitialServiceName(undefined);
        setIsEditing(true);
        setActiveTab("details");
        return;
      }

      console.log("Resetting form with data:", enrollmentData);
      const firstServiceSchedule = enrollmentData.serviceSchedules?.[0];
      const formServiceSchedule: EnrollmentFormData["serviceSchedule"] =
        firstServiceSchedule
          ? {
              frequency: firstServiceSchedule.frequency,
              daysOfWeek: firstServiceSchedule.daysOfWeek?.map(String),
              dayOfMonth: firstServiceSchedule.dayOfMonth,
              startTime: firstServiceSchedule.startTime ?? "",
              endTime: firstServiceSchedule.endTime ?? "",
            }
          : undefined;

      const formChargeSchedule: EnrollmentFormData["chargeSchedule"] =
        enrollmentData.chargeSchedule
          ? {
              billingModel: enrollmentData.chargeSchedule.billingModel,
              recurrenceInterval:
                enrollmentData.chargeSchedule.recurrenceInterval,
              chargeDay: String(enrollmentData.chargeSchedule.chargeDay ?? ""),
              dueDate: enrollmentData.chargeSchedule.dueDate
                ? format(
                    parse(
                      String(enrollmentData.chargeSchedule.dueDate),
                      "yyyy-MM-dd",
                      new Date()
                    ),
                    "dd/MM/yyyy"
                  )
                : undefined,
            }
          : undefined;

      const parsedStartDate = enrollmentData.startDate
        ? parse(String(enrollmentData.startDate), "yyyy-MM-dd", new Date())
        : null;
      const parsedEndDate = enrollmentData.endDate
        ? parse(String(enrollmentData.endDate), "yyyy-MM-dd", new Date())
        : null;

      const formData: EnrollmentFormData = {
        serviceId: enrollmentData.service.id,
        clientId: enrollmentData.client.id,
        price: formatCurrency(enrollmentData.price),
        startDate:
          parsedStartDate && isValid(parsedStartDate)
            ? format(parsedStartDate, "dd/MM/yyyy")
            : format(new Date(), "dd/MM/yyyy"),
        endDate:
          parsedEndDate && isValid(parsedEndDate)
            ? format(parsedEndDate, "dd/MM/yyyy")
            : undefined,
        status: enrollmentData.status,
        chargeSchedule: formChargeSchedule,
        serviceSchedule: formServiceSchedule,
      };
      console.log("Setting form data:", formData);
      reset(formData);
      setInitialServiceName(enrollmentData.service.name);
      setIsEditing(false);
      setActiveTab("details");
    },
    [reset, serviceIdParam]
  );

  useEffect(() => {
    setError(null);

    if (isCreating) {
      resetFormFromEnrollment(null);
      setIsEditing(true);
      setActiveTab("details");
    } else {
      setEnrollment(null);
      setInitialServiceName(undefined);
      setIsEditing(false);
      fetchEnrollment();
    }
  }, [enrollmentId, resetFormFromEnrollment]);

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
      resetFormFromEnrollment(enrollmentData);
    } catch (err) {
      setError("Não foi possível carregar os detalhes do contrato.");
      console.error("Fetch enrollment error:", err);
      setEnrollment(null);
      resetFormFromEnrollment(null);
    } finally {
      setLoading(false);
    }
  }, [enrollmentId, isCreating, resetFormFromEnrollment]);

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
    if (serviceIdParam) {
      router.replace(`/(tabs)/(provider)/services/${serviceIdParam}`);
    } else {
      router.replace("/(tabs)/(provider)/services/");
    }
  };

  const handleEdit = () => {
    if (!enrollment) return;
    addToast(`Editando contrato`, "warning");
    setIsEditing(true);
    setActiveTab("details");
  };

  const handleCancelEdit = () => {
    if (isCreating) {
      handleBack();
      return;
    }
    if (enrollment) {
      addToast(`Cancelando edição`, "warning");
      resetFormFromEnrollment(enrollment);
    }
    setIsEditing(false);
  };

  const formatDataForApi = (
    formData: EnrollmentFormData
  ): Partial<CreateEnrollmentDto> => {
    console.log("--- formatDataForApi ---");
    console.log("formData recebido:", JSON.stringify(formData, null, 2));

    const apiPayload: any = {
      price: parseCurrency(formData.price),
      serviceId: formData.serviceId || serviceIdParam,
      clientId: formData.clientId,
    };

    const parsedStartDate = parseInputDateString(
      formData.startDate as string | undefined
    );
    if (parsedStartDate) {
      apiPayload.startDate = formatToISODateString(parsedStartDate);
    } else {
      console.error(
        "ERRO: formData.startDate inválido ou ausente:",
        formData.startDate
      );
      return {};
    }

    const parsedEndDate = parseInputDateString(
      formData.endDate as string | undefined
    );
    if (parsedEndDate) {
      apiPayload.endDate = formatToISODateString(parsedEndDate);
    }

    if (formData.chargeSchedule) {
      const inputChargeSchedule = formData.chargeSchedule;
      const chargeDto: Partial<CreateChargeScheduleDto> = {
        billingModel: inputChargeSchedule.billingModel,
      };
      const chargeDayNum = Number(inputChargeSchedule.chargeDay);
      if (!isNaN(chargeDayNum)) {
        chargeDto.chargeDay = chargeDayNum;
      } else {
        console.error(
          "ERRO: chargeSchedule.chargeDay inválido:",
          inputChargeSchedule.chargeDay
        );
      }

      if (inputChargeSchedule.billingModel === BILLING_MODEL.RECURRING) {
        chargeDto.recurrenceInterval = inputChargeSchedule.recurrenceInterval;
        delete chargeDto.dueDate;
      } else if (inputChargeSchedule.billingModel === BILLING_MODEL.ONE_TIME) {
        const parsedDueDate = parseInputDateString(
          inputChargeSchedule.dueDate as string | undefined
        );
        if (parsedDueDate) {
          chargeDto.dueDate = formatToISODateString(parsedDueDate);
        }
        delete chargeDto.recurrenceInterval;
      }

      if (chargeDto.billingModel && chargeDto.chargeDay !== undefined) {
        apiPayload.chargeSchedule = chargeDto;
      } else {
        console.error("ERRO: chargeSchedule incompleto:", chargeDto);
      }
    } else {
      console.error("ERRO: formData.chargeSchedule está ausente.");
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (formData.serviceSchedule?.frequency === "") {
      console.log("Frequência vazia, omitindo serviceSchedules.");
    } else if (formData.serviceSchedule?.frequency) {
      const inputServiceSchedule = formData.serviceSchedule;
      const serviceDto: Partial<CreateServiceScheduleDto> = {
        frequency: inputServiceSchedule.frequency,
      };

      if (
        inputServiceSchedule.startTime &&
        timeRegex.test(inputServiceSchedule.startTime)
      ) {
        serviceDto.startTime = inputServiceSchedule.startTime;
      }

      if (
        inputServiceSchedule.endTime &&
        timeRegex.test(inputServiceSchedule.endTime)
      ) {
        serviceDto.endTime = inputServiceSchedule.endTime;
      }

      if (
        inputServiceSchedule.daysOfWeek &&
        inputServiceSchedule.daysOfWeek.length > 0
      ) {
        serviceDto.daysOfWeek = inputServiceSchedule.daysOfWeek.map(String);
      }
      if (inputServiceSchedule.dayOfMonth) {
        serviceDto.dayOfMonth = String(inputServiceSchedule.dayOfMonth);
      }

      const freq = serviceDto.frequency;
      if (freq !== "WEEKLY") delete serviceDto.daysOfWeek;
      if (freq !== "MONTHLY") delete serviceDto.dayOfMonth;

      if (serviceDto.frequency) {
        apiPayload.serviceSchedules = serviceDto;
      }
    } else {
      console.log(
        "serviceSchedule ou frequency ausente, omitindo serviceSchedules."
      );
    }

    console.log(
      "Payload FINAL formatado para API:",
      JSON.stringify(apiPayload, null, 2)
    );
    return apiPayload;
  };

  const onSubmit = async (formData: EnrollmentFormData) => {
    setIsSubmitting(true);
    let apiData: Partial<CreateEnrollmentDto> | null = null;
    try {
      apiData = formatDataForApi(formData);
      console.log("Enviando para API:", apiData);

      if (Object.keys(apiData).length === 0 || !apiData.startDate) {
        throw new Error(
          "Falha na formatação dos dados. Verifique a Data de Início."
        );
      }
      if (!apiData.clientId) {
        throw new Error("Cliente é obrigatório.");
      }
      if (!apiData.chargeSchedule) {
        throw new Error("Configuração de cobrança é obrigatória.");
      }

      if (isCreating) {
        const createDto: CreateEnrollmentDto = apiData as CreateEnrollmentDto;
        const response = await api.post<Enrollments>("enrollments", createDto);
        addToast(`Contrato criado com sucesso`, "success");
        resetFormFromEnrollment(null);
        router.push(`/(tabs)/(provider)/enrollments/${response.data.id}`);
      } else {
        const updateDto: UpdateEnrollmentDto = apiData;
        const response = await api.patch<Enrollments>(
          `enrollments/${enrollmentId}`,
          updateDto
        );
        addToast(`Contrato salvo com sucesso`, "success");
        const updatedEnrollment = response.data;
        setEnrollment(updatedEnrollment);
        resetFormFromEnrollment(updatedEnrollment);
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error(
        "Failed to save enrollment:",
        err?.response?.data || err?.message || err
      );
      const errorMessage =
        err?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(", ")
          : err?.response?.data?.message || "Erro desconhecido");
      addToast(`Não foi possível salvar: ${errorMessage}`, "error");
    } finally {
      setIsSubmitting(false);
    }
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
                className="text-foreground"
              />
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
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
          enrollment && (
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
          )
        )}
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
