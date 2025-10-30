import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSearchableSelect } from "@/components/forms/controlled-searchable-select";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import { Client } from "@/types/client";

import { ENROLLMENT_STATUS } from "@/types/enrollment-status";
import { EnrollmentFormData, Enrollments } from "@/types/enrollments";
import React from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";

type EnrollmentDetailsTabProps = {
  control: Control<EnrollmentFormData>;
  isEditing: boolean;
  enrollment: Enrollments | null;
  initialServiceName?: string;
  serviceIdFromQuery?: string;
};

const statusOptions = [
  { label: "Ativo", value: ENROLLMENT_STATUS.ACTIVE },
  { label: "Pausado", value: ENROLLMENT_STATUS.INACTIVE },
  { label: "Concluído", value: ENROLLMENT_STATUS.COMPLETED },
  { label: "Cancelado", value: ENROLLMENT_STATUS.CANCELLED },
];

export function EnrollmentDetailsTab({
  control,
  isEditing,
  enrollment,
  initialServiceName,
  serviceIdFromQuery,
}: EnrollmentDetailsTabProps) {
  const getStatusLabel = (value: string) =>
    statusOptions.find((opt) => opt.value === value)?.label || "N/A";

  return (
    <View className="w-full gap-5 px-5 pt-5">
      <View className="w-full p-4 rounded-xl gap-3 bg-card shadow-sm">
        <ThemedText className="text-base font-semibold text-card-foreground">
          Informações do Contrato
        </ThemedText>

        <View className="gap-1 mb-2">
          <ThemedText type="labelInput" className="text-primary">
            Serviço
          </ThemedText>
          <View className="border-l-4 border-primary rounded-lg px-3 py-3 min-h-[50px] justify-center bg-light">
            <ThemedText className="text-base text-black">
              {initialServiceName || "Carregando serviço..."}
            </ThemedText>
          </View>
        </View>

        <ControlledSearchableSelect<Client>
          control={control}
          name="clientId"
          label="Cliente"
          modalTitle="Buscar Cliente"
          fetchEndpoint="client"
          initialSelectedName={enrollment?.client?.user?.username}
          disabled={!isEditing}
          allowCreation={true}
          createEndpoint="client/register-by-provider"
          valueAccessor={(item) => item.id}
          displayAccessor={(item) => item.user.username}
          renderListItem={(item) => (
            <View>
              <ThemedText className="text-black text-base">
                {item.user.username}
              </ThemedText>
              <ThemedText className="text-black text-sm">
                {item.user.email}
              </ThemedText>
            </View>
          )}
        />

        <ControlledInput
          control={control}
          name="price"
          label="Preço Acordado (R$)"
          placeholder="R$ 0,00"
          keyboardType="numeric"
          disabled={!isEditing}
        />

        <ControlledInput
          control={control}
          name="startDate"
          label="Data de Início"
          placeholder="DD/MM/YYYY"
          maskType="date"
          disabled={!isEditing}
        />

        <ControlledInput
          control={control}
          name="endDate"
          label="Data de Término (Opcional)"
          placeholder="DD/MM/YYYY"
          maskType="date"
          disabled={!isEditing}
        />

        {isEditing ? (
          <ControlledSelect
            control={control}
            name="status"
            label="Status"
            options={statusOptions}
            placeholder="Selecione o status"
            disabled={!isEditing}
          />
        ) : (
          <View className="gap-2">
            <ThemedText className="text-primary" type="labelInput">
              Status
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {getStatusLabel(enrollment?.status || "")}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}
