import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import {
  CreateServiceScheduleDto,
  EnrollmentFormData,
  Enrollments,
} from "@/types/enrollments";
import { ServiceSchedule } from "@/types/service-schedule";
import { Ionicons } from "@expo/vector-icons";
import {
  addDays,
  addMonths,
  Day,
  format,
  isBefore,
  isValid,
  parse,
  setDate,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useMemo } from "react";
import { Control, useWatch } from "react-hook-form";
import { View } from "react-native";

type EnrollmentServiceTabProps = {
  control: Control<EnrollmentFormData>;
  isEditing: boolean;
  enrollment: Enrollments | null;
};

const frequencyOptions = [
  { label: "Diário", value: "DAILY" },
  { label: "Semanal", value: "WEEKLY" },
  { label: "Mensal", value: "MONTHLY" },
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

const calculateFirstOccurrenceDate = (
  contractStartDate: Date | undefined | null,
  schedule: CreateServiceScheduleDto | undefined
): string => {
  const isDateValid = contractStartDate && isValid(contractStartDate);

  if (!isDateValid) {
    return "Defina uma Data de Início válida";
  }
  const start = startOfDay(contractStartDate as Date);

  if (!schedule?.frequency) {
    return format(start, "dd/MM/yyyy '(Data Única)'", { locale: ptBR });
  }

  try {
    switch (schedule.frequency) {
      case "DAILY":
        return format(start, "dd/MM/yyyy ' (Diário)'", { locale: ptBR });

      case "WEEKLY": {
        if (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0) {
          return "Selecione os dias da semana";
        }
        const selectedDays = schedule.daysOfWeek
          .map((d: string) => Number(d))
          .filter((d: number) => d >= 0 && d <= 6)
          .sort((a: number, b: number) => a - b);

        if (selectedDays.length === 0) return "Seleção de dias inválida";

        let firstOccurrence = start;
        let foundDay: Day | null = null;
        let iterations = 0;

        while (foundDay === null && iterations < 370) {
          iterations++;
          const currentDayOfWeek = firstOccurrence.getDay() as Day;

          if (selectedDays.includes(currentDayOfWeek)) {
            if (!isBefore(firstOccurrence, start)) {
              foundDay = currentDayOfWeek;
              break;
            }
          }
          firstOccurrence = addDays(firstOccurrence, 1);
        }

        if (foundDay !== null) {
          const dayLabel =
            dayOfWeekOptions.find((opt) => Number(opt.value) === foundDay)
              ?.label || "";
          const result = format(firstOccurrence, `dd/MM/yyyy ('${dayLabel}')`, {
            locale: ptBR,
          });
          return result;
        } else {
          console.error(
            "[CALC 2b] Erro: Loop não encontrou dia semanal válido a partir da data de início."
          );
          return "Erro ao calcular dia semanal";
        }
      }

      case "MONTHLY": {
        if (!schedule.dayOfMonth) {
          return "Defina o Dia do Mês (1-31)";
        }
        const dayOfMonth = Number(schedule.dayOfMonth);
        if (isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31)
          return "Dia do Mês inválido (1-31)";

        let firstOccurrence = setDate(start, dayOfMonth);

        if (isBefore(firstOccurrence, start)) {
          firstOccurrence = addMonths(firstOccurrence, 1);
        }
        const result = format(firstOccurrence, "dd/MM/yyyy '(Mensal)'", {
          locale: ptBR,
        });
        return result;
      }
      default:
        return "Selecione uma Frequência válida";
    }
  } catch (e) {
    console.error("Erro CRÍTICO ao calcular data:", e);
    return "Erro no cálculo";
  }
};

export function EnrollmentServiceTab({
  control,
  isEditing,
  enrollment,
}: EnrollmentServiceTabProps) {
  const firstSchedule: ServiceSchedule | undefined =
    enrollment?.serviceSchedules?.[0];

  const defaultScheduleValue: CreateServiceScheduleDto | undefined =
    firstSchedule
      ? {
          frequency: firstSchedule.frequency,
          daysOfWeek: firstSchedule.daysOfWeek?.map(String),
          dayOfMonth: firstSchedule.dayOfMonth,
          startTime: firstSchedule.startTime,
          endTime: firstSchedule.endTime,
        }
      : { frequency: "WEEKLY" };

  const watchedSchedule = useWatch({
    control,
    name: "serviceSchedule",
    defaultValue: defaultScheduleValue,
  });

  const rawStartDate = useWatch({
    control,
    name: "startDate",
    defaultValue: enrollment?.startDate,
  });
  const contractStartDate = useMemo(() => {
    // rawStartDate is the string "DD/MM/YYYY" or undefined/null
    if (
      rawStartDate &&
      typeof rawStartDate === "string" &&
      rawStartDate.match(/^\d{2}\/\d{2}\/\d{4}$/)
    ) {
      // Use parse with the correct format
      const parsed = parse(rawStartDate, "dd/MM/yyyy", new Date());
      return isValid(parsed) ? parsed : null;
    }
    // Handle cases where rawStartDate might already be a Date (less likely with mask input)
    if (rawStartDate instanceof Date && isValid(rawStartDate)) {
      return rawStartDate;
    }
    // Return null if input is invalid or not a recognizable format/type
    return null;
  }, [rawStartDate]);

  const firstOccurrenceDisplay = useMemo(() => {
    return calculateFirstOccurrenceDate(contractStartDate, watchedSchedule);
  }, [contractStartDate, watchedSchedule]);

  const getFrequencyLabel = (value: string | undefined) =>
    frequencyOptions.find((opt) => opt.value === value)?.label || "N/A";

  const getAggregatedDaysOfWeek = (): number[] => {
    if (!enrollment?.serviceSchedules) return [];
    const weeklySchedules = enrollment.serviceSchedules.filter(
      (s: ServiceSchedule) =>
        s.frequency === "WEEKLY" && s.daysOfWeek && s.daysOfWeek.length > 0
    );
    const uniqueDays = [
      ...new Set(
        weeklySchedules.flatMap((s: ServiceSchedule) => s.daysOfWeek || [])
      ),
    ];
    uniqueDays.sort((a: number, b: number) => a - b);
    return uniqueDays;
  };

  const aggregatedDaysOfWeek = getAggregatedDaysOfWeek();

  const getDaysOfWeekLabels = (values?: number[]) => {
    if (!values || values.length === 0) return "N/A";
    return values
      .map(
        (v: number) =>
          dayOfWeekOptions.find((opt) => String(opt.value) === String(v))?.label
      )
      .filter(Boolean)
      .join(", ");
  };

  const renderConditionalFields = () => {
    const currentServiceFrequency = watchedSchedule?.frequency;

    if (currentServiceFrequency === "WEEKLY") {
      return isEditing ? (
        <ControlledSelect
          control={control}
          name="serviceSchedule.daysOfWeek"
          label="Dias da Semana"
          options={dayOfWeekOptions}
          placeholder="Selecione os dias"
          isMultiple={true}
          disabled={!isEditing}
        />
      ) : (
        <View className="gap-2">
          <ThemedText className="text-primary" type="labelInput">
            Dias da Semana
          </ThemedText>
          <ThemedText className="text-card-foreground text-sm">
            {getDaysOfWeekLabels(aggregatedDaysOfWeek)}
          </ThemedText>
        </View>
      );
    } else if (currentServiceFrequency === "MONTHLY") {
      return (
        <ControlledInput
          control={control}
          name="serviceSchedule.dayOfMonth"
          label="Dia do Mês (ex: 15)"
          placeholder="15"
          keyboardType="numeric"
          disabled={!isEditing}
        />
      );
    }
    return null;
  };

  const currentServiceFrequency = watchedSchedule?.frequency;
  const isRecurrentFrequency =
    currentServiceFrequency === "DAILY" ||
    currentServiceFrequency === "WEEKLY" ||
    currentServiceFrequency === "MONTHLY";

  const displayFrequencyLabel = firstSchedule
    ? getFrequencyLabel(firstSchedule.frequency)
    : enrollment?.startDate
      ? "(Data Única - Usa Início Contrato)"
      : "N/A";

  return (
    <View className="w-full gap-5 px-5 pt-5">
      <View className="w-full p-4 rounded-xl gap-3 bg-card shadow-sm">
        <ThemedText className="text-base font-semibold text-card-foreground">
          Agenda de Serviço
        </ThemedText>

        {isEditing && isRecurrentFrequency && (
          <View className="flex-row items-center gap-2 p-3 bg-primary  rounded-lg mt-1 mb-1">
            <Ionicons
              name="calendar-outline"
              size={20}
              className="text-light"
            />
            <ThemedText className="text-sm text-light flex-1">
              Primeiro serviço agendado para:{" "}
              <ThemedText className="font-semibold">
                {firstOccurrenceDisplay}
              </ThemedText>{" "}
              (baseado na Data de Início do contrato).
            </ThemedText>
          </View>
        )}
        {isEditing && !isRecurrentFrequency && (
          <View className="flex-row items-center gap-2 p-3 bg-primary rounded-lg  mt-1 mb-1">
            <Ionicons
              name="information-circle-outline"
              size={20}
              className="text-dark"
            />
            <ThemedText className="text-sm text-dark flex-1">
              O serviço ocorrerá uma única vez na{" "}
              <ThemedText className="font-semibold">Data de Início</ThemedText>{" "}
              do contrato. Defina os horários abaixo.
            </ThemedText>
          </View>
        )}

        {isEditing ? (
          <ControlledSelect
            control={control}
            name="serviceSchedule.frequency"
            label="Frequência do Serviço"
            options={frequencyOptions}
            placeholder="Nenhuma (Data Única)"
            disabled={!isEditing}
          />
        ) : (
          <View className="gap-2">
            <ThemedText className="text-primary" type="labelInput">
              Frequência do Serviço
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {displayFrequencyLabel}
            </ThemedText>
          </View>
        )}

        {renderConditionalFields()}

        <ControlledInput
          control={control}
          name="serviceSchedule.startTime"
          label="Horário de Início (HH:mm)"
          placeholder="09:00"
          disabled={!isEditing}
        />

        <ControlledInput
          control={control}
          name="serviceSchedule.endTime"
          label="Horário de Término (HH:mm, opcional)"
          placeholder="10:00"
          disabled={!isEditing}
        />
      </View>
    </View>
  );
}
