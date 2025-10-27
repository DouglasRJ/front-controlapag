import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import { paymentMethodOptions } from "@/constants/service-payment-methods";
import { Service } from "@/types/service";
import React from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";

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

type ServiceDetailsTabProps = {
  control: Control<ServiceDetailFormData>;
  isEditing: boolean;
  service: Service | null;
  hasFixedLocation: boolean | undefined;
  hasFixedPrice: boolean | undefined;
  isRecurrent: boolean | undefined;
};

export function ServiceDetailsTab({
  control,
  isEditing,
  service,
  hasFixedLocation,
  hasFixedPrice,
  isRecurrent,
}: ServiceDetailsTabProps) {
  return (
    <View className="w-full gap-5 px-5 pt-5">
      {/* Informações Básicas */}
      <View className="w-full p-4 rounded-xl justify-between min-h-[60px] bg-card shadow-sm">
        <ThemedText className="text-card-foreground font-semibold mb-2">
          Informações básicas
        </ThemedText>
        <ControlledInput
          control={control}
          name="name"
          label="Nome"
          placeholder="Nome do Serviço"
          disabled={!isEditing}
        />
        <ControlledInput
          control={control}
          name="description"
          label="Descrição"
          placeholder="Descrição do Serviço"
          multiline
          numberOfLines={4}
          disabled={!isEditing}
        />
        {isEditing ? (
          <ControlledCheckbox
            control={control}
            name="isRecurrent"
            label="É um serviço recorrente?"
            disabled={!isEditing}
          />
        ) : (
          <View className="flex-row gap-4 items-center mt-3">
            <ThemedText className="text-primary" type="labelInput">
              É um serviço recorrente?
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {service?.isRecurrent ? "Sim" : "Não"}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Localidade */}
      <View className="w-full p-4 rounded-xl justify-between min-h-[60px] gap-3 bg-card shadow-sm">
        <ThemedText className="text-base font-semibold mb-2 text-card-foreground">
          Localidade Padrão
        </ThemedText>
        {isEditing ? (
          <ControlledCheckbox
            control={control}
            name="hasFixedLocation"
            label="Possui local fixo padrão?"
            disabled={!isEditing}
          />
        ) : (
          <View className="flex-row gap-4 items-center">
            <ThemedText className="text-primary" type="labelInput">
              Possui local fixo padrão?
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {service?.address ? "Sim" : "Não"}
            </ThemedText>
          </View>
        )}

        {hasFixedLocation && (
          <ControlledInput
            control={control}
            name="address"
            label="Endereço Padrão"
            placeholder="Endereço onde o serviço geralmente ocorre"
            disabled={!isEditing}
          />
        )}
        {!hasFixedLocation && !isEditing && (
          <ThemedText className="text-sm font-medium opacity-70 pl-1 text-card-foreground mt-1">
            Localidade variável ou definida por contrato.
          </ThemedText>
        )}
      </View>

      {/* Preços e Pagamentos Padrão */}
      <View className="w-full p-4 rounded-xl justify-between min-h-[60px] gap-3 bg-card shadow-sm">
        <ThemedText className="text-base font-semibold mb-2 text-card-foreground">
          Preços e Pagamentos Padrão
        </ThemedText>
        {isEditing ? (
          <ControlledCheckbox
            control={control}
            name="hasFixedPrice"
            label="Possui preço padrão?"
            disabled={!isEditing}
          />
        ) : (
          <View className="flex-row gap-4 items-center">
            <ThemedText className="text-primary" type="labelInput">
              Possui preço padrão?
            </ThemedText>
            <ThemedText className="text-card-foreground text-sm">
              {service?.defaultPrice !== null &&
              service?.defaultPrice !== undefined
                ? "Sim"
                : "Não"}
            </ThemedText>
          </View>
        )}

        {hasFixedPrice && (
          <ControlledInput
            control={control}
            name="defaultPrice"
            label="Preço Padrão (R$)"
            placeholder="Valor de referência"
            keyboardType="numeric"
            disabled={!isEditing}
          />
        )}
        {!hasFixedPrice && !isEditing && (
          <ThemedText className="text-sm font-medium opacity-70 pl-1 text-card-foreground mt-1">
            Preço negociado por contrato.
          </ThemedText>
        )}

        <ControlledSelect
          control={control}
          name="allowedPaymentMethods"
          label="Métodos de pagamento aceitos"
          options={paymentMethodOptions}
          placeholder="Selecione os métodos"
          isMultiple
          disabled={!isEditing}
        />
      </View>
    </View>
  );
}
