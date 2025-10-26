import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import { BILLING_MODEL } from "@/types/billing-model";
import { EnrollmentFormData, Enrollments } from "@/types/enrollments";
import { RECURRENCE_INTERVAL } from "@/types/recurrence-interval";
import React from "react";
import { Control, useWatch } from "react-hook-form";
import { View } from "react-native";

type EnrollmentChargeTabProps = {
  control: Control<EnrollmentFormData>;
  isEditing: boolean;
  enrollment: Enrollments | null;
};

const billingModelOptions = [
  { label: "Recorrente", value: BILLING_MODEL.RECURRING },
  { label: "Única", value: BILLING_MODEL.ONE_TIME },
];

const recurrenceIntervalOptions = [
  { label: "Semanal", value: RECURRENCE_INTERVAL.WEEKLY },
  { label: "Mensal", value: RECURRENCE_INTERVAL.MONTHLY },
];

const dayOfWeekOptions = [
  { label: "Domingo", value: "0" },
  { label: "Segunda", value: "1" },
  { label: "Terça", value: "2" },
  { label: "Quarta", value: "3" },
  { label: "Quinta", value: "4" },
  { label: "Sexta", value: "5" },
  { label: "Sábado", value: "6" },
];

export function EnrollmentChargeTab({
  control,
  isEditing,
  enrollment,
}: EnrollmentChargeTabProps) {
  const chargeData = enrollment?.chargeSchedule;

  const billingModel = useWatch({
    control,
    name: "chargeSchedule.billingModel",
    defaultValue: chargeData?.billingModel || BILLING_MODEL.RECURRING,
  });

  const recurrenceInterval = useWatch({
    control,
    name: "chargeSchedule.recurrenceInterval",
    defaultValue: chargeData?.recurrenceInterval,
  });

  const getBillingModelLabel = (value: string | undefined) =>
    billingModelOptions.find((opt) => opt.value === value)?.label || "N/A";

  const getRecurrenceIntervalLabel = (value: string | undefined) =>
    recurrenceIntervalOptions.find((opt) => opt.value === value)?.label ||
    "N/A";

  const getChargeDayLabel = () => {
    if (billingModel === BILLING_MODEL.ONE_TIME) {
      return "Dia do Vencimento (Obrigatório se Cobrança Única)";
    }
    if (recurrenceInterval === RECURRENCE_INTERVAL.MONTHLY) {
      return "Dia do Mês para Cobrança (1-31)";
    }
    if (recurrenceInterval === RECURRENCE_INTERVAL.WEEKLY) {
      return "Dia da Semana para Cobrança (0-6)";
    }
    return "Dia da Cobrança"; // Genérico
  };

  const getChargeDayDisplayValue = () => {
    const day = chargeData?.chargeDay;
    if (day === undefined || day === null) return "N/A";

    if (chargeData?.recurrenceInterval === RECURRENCE_INTERVAL.WEEKLY) {
      return (
        dayOfWeekOptions.find((opt) => Number(opt.value) === day)?.label ||
        String(day)
      );
    }
    return String(day);
  };

  return (
    <View className="w-full gap-5 px-5 pt-5">
      <View className="w-full p-4 rounded-xl gap-3 bg-card shadow-sm">
        <ThemedText className="text-base font-semibold text-card-foreground">
          Configuração de Cobrança
        </ThemedText>

        {isEditing ? (
          <ControlledSelect
            control={control}
            name="chargeSchedule.billingModel"
            label="Modelo de Cobrança"
            options={billingModelOptions}
            placeholder="Selecione o modelo"
            disabled={!isEditing}
          />
        ) : (
          <View className="gap-2">
            <ThemedText className="text-primary" type="labelInput">
              Modelo de Cobrança
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {getBillingModelLabel(chargeData?.billingModel)}
            </ThemedText>
          </View>
        )}

        {billingModel === BILLING_MODEL.RECURRING &&
          (isEditing ? (
            <ControlledSelect
              control={control}
              name="chargeSchedule.recurrenceInterval"
              label="Intervalo da Recorrência"
              options={recurrenceIntervalOptions}
              placeholder="Selecione o intervalo"
              disabled={!isEditing}
            />
          ) : (
            <View className="gap-2">
              <ThemedText className="text-primary" type="labelInput">
                Intervalo da Recorrência
              </ThemedText>
              <ThemedText className="text-card-foreground text-sm">
                {getRecurrenceIntervalLabel(chargeData?.recurrenceInterval)}
              </ThemedText>
            </View>
          ))}

        <ControlledInput
          control={control}
          name="chargeSchedule.chargeDay"
          label={getChargeDayLabel()}
          placeholder={
            recurrenceInterval === RECURRENCE_INTERVAL.WEEKLY
              ? "Ex: 1 (Segunda)"
              : "Ex: 15"
          }
          keyboardType="numeric"
          disabled={!isEditing}
        />

        {billingModel === BILLING_MODEL.ONE_TIME && (
          <ControlledInput
            control={control}
            name="chargeSchedule.dueDate"
            label="Data de Vencimento (Única Cobrança)"
            placeholder="DD/MM/YYYY"
            maskType="date"
            disabled={!isEditing}
          />
        )}

        {!isEditing &&
          chargeData?.dueDate &&
          billingModel === BILLING_MODEL.ONE_TIME && (
            <View className="gap-2">
              <ThemedText className="text-primary" type="labelInput">
                Data de Vencimento (Única Cobrança)
              </ThemedText>
              <ThemedText className="text-card-foreground text-sm">
                {chargeData.dueDate
                  ? new Date(chargeData.dueDate).toLocaleDateString("pt-BR")
                  : "N/A"}
              </ThemedText>
            </View>
          )}
        {!isEditing && recurrenceInterval === RECURRENCE_INTERVAL.WEEKLY && (
          <View className="gap-2">
            <ThemedText className="text-primary" type="labelInput">
              Dia da Semana para Cobrança
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {getChargeDayDisplayValue()}
            </ThemedText>
          </View>
        )}
        {!isEditing && recurrenceInterval === RECURRENCE_INTERVAL.MONTHLY && (
          <View className="gap-2">
            <ThemedText className="text-primary" type="labelInput">
              Dia do Mês para Cobrança
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {getChargeDayDisplayValue()}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}
