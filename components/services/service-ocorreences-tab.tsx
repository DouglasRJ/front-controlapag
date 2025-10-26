import { ThemedText } from "@/components/themed-text";
import api from "@/services/api";
import { ServiceOccurrence } from "@/types/service-ocurrency";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subDays,
} from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Button } from "../ui/button";
import { OccurrenceCard } from "./ocurrence-card";

type ServiceOccurrencesTabProps = { serviceId: string | undefined };

const formatDateForAPI = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

const formatRangeForDisplay = (
  start: Date | null,
  end: Date,
  isPast: boolean
) => {
  if (isPast) return `Até ${end.toLocaleDateString()}`;
  if (!start) return "Período inválido";
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};
const VERY_OLD_DATE = new Date(1970, 0, 1);
const FAR_FUTURE_DATE = new Date(2100, 11, 31);

type ActiveView = "past" | "week" | "next7" | "month" | "nextMonth" | "all";

export function ServiceOccurrencesTab({
  serviceId,
}: ServiceOccurrencesTabProps) {
  const [occurrences, setOccurrences] = useState<ServiceOccurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = startOfToday();
  const initialEndDate = addDays(today, 6);
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date>(initialEndDate);
  const [isPastView, setIsPastView] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("next7");

  const fetchOccurrences = useCallback(
    async (start: Date | null, end: Date) => {
      if (!serviceId) return;
      setLoading(true);
      setError(null);
      try {
        const startStr = formatDateForAPI(start ?? VERY_OLD_DATE);
        const endStr = formatDateForAPI(end);

        const response = await api.get<ServiceOccurrence[]>(
          `service/${serviceId}/occurrences`,
          { params: { startDate: startStr, endDate: endStr } }
        );

        const sortedOccurrences = response.data.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateA === dateB) {
            const timeA = a.startTime || "00:00";
            const timeB = b.startTime || "00:00";
            return isPastView
              ? timeB.localeCompare(timeA)
              : timeA.localeCompare(timeB);
          }
          return isPastView ? dateB - dateA : dateA - dateB;
        });
        setOccurrences(sortedOccurrences);
      } catch (err: any) {
        console.error(
          "Failed to fetch occurrences:",
          err?.response?.data || err?.message || err
        );
        setError("Sem agendamentos para este serviço");
        setOccurrences([]);
      } finally {
        setLoading(false);
      }
    },
    [serviceId, isPastView]
  );

  useEffect(() => {
    fetchOccurrences(startDate, endDate);
  }, [startDate, endDate, fetchOccurrences]);

  const setThisWeek = () => {
    const today = startOfToday();
    setIsPastView(false);
    setActiveView("week");
    setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
    setEndDate(endOfWeek(today, { weekStartsOn: 1 }));
  };
  const setNext7Days = () => {
    const today = startOfToday();
    setIsPastView(false);
    setActiveView("next7");
    setStartDate(today);
    setEndDate(addDays(today, 6));
  };
  const setThisMonth = () => {
    const today = startOfToday();
    setIsPastView(false);
    setActiveView("month");
    setStartDate(startOfMonth(today));
    setEndDate(endOfMonth(today));
  };
  const setNextMonth = () => {
    const today = startOfToday();
    const nextMonthStart = startOfMonth(addMonths(today, 1));
    setIsPastView(false);
    setActiveView("nextMonth");
    setStartDate(nextMonthStart);
    setEndDate(endOfMonth(nextMonthStart));
  };
  const setPastOccurrences = () => {
    const yesterday = subDays(startOfToday(), 1);
    setIsPastView(true);
    setActiveView("past");
    setStartDate(null);
    setEndDate(yesterday);
  };
  const setAllOccurrences = () => {
    setIsPastView(false);
    setActiveView("all");
    setStartDate(VERY_OLD_DATE);
    setEndDate(FAR_FUTURE_DATE);
  };

  return (
    <View className="w-full gap-4 px-5 pt-5 flex-1">
      <View className="mb-2 rounded-lg border border-border bg-card p-3">
        <ThemedText className="text-sm font-semibold text-muted-foreground mb-3 px-1">
          Filtrar por Período
        </ThemedText>
        <View className="flex-row justify-center flex-wrap gap-2">
          <Button
            title="Passado"
            onPress={setPastOccurrences}
            size="sm"
            variant={activeView === "past" ? "default" : "outline"}
          />
          <Button
            title="Todos"
            onPress={setAllOccurrences}
            size="sm"
            variant={activeView === "all" ? "default" : "outline"}
          />
          <Button
            title="Esta Semana"
            onPress={setThisWeek}
            size="sm"
            variant={activeView === "week" ? "default" : "outline"}
          ></Button>
          <Button
            title="Próx. 7 dias"
            onPress={setNext7Days}
            size="sm"
            variant={activeView === "next7" ? "default" : "outline"}
          ></Button>
          <Button
            title="Este Mês"
            onPress={setThisMonth}
            size="sm"
            variant={activeView === "month" ? "default" : "outline"}
          ></Button>
          <Button
            title="Próx. Mês"
            onPress={setNextMonth}
            size="sm"
            variant={activeView === "nextMonth" ? "default" : "outline"}
          ></Button>
        </View>
      </View>
      <View className="mb-2 rounded-lg items-center border border-border bg-primary p-3">
        <ThemedText className="text-sm font-semibold text-light">
          {activeView === "all"
            ? "Exibindo: Todos os agendamentos"
            : `Exibindo: ${formatRangeForDisplay(startDate, endDate, isPastView)}`}
        </ThemedText>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="text-tint" className="mt-10" />
      ) : error ? (
        <ThemedText className="text-center text-foreground mt-10">
          {error}
        </ThemedText>
      ) : (
        <FlatList
          data={occurrences}
          keyExtractor={(item, index) =>
            `${
              item.enrollmentId || "no-enrollment"
            }-${item.date}-${item.startTime || index}`
          }
          renderItem={({ item }) => <OccurrenceCard occurrence={item} />}
          ListEmptyComponent={
            <View className="items-center justify-center mt-10">
              <ThemedText className="text-foreground text-sm">
                Nenhum agendamento encontrado para este período.
              </ThemedText>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
