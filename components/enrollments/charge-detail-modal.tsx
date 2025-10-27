import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import api from "@/services/api";
import { useToastStore } from "@/store/toastStore";
import { Charge } from "@/types/charge";
import { CHARGE_STATUS } from "@/types/charge-status";
import { formatCurrency } from "@/utils/format-currency";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

type ChargeDetailModalProps = {
  visible: boolean;
  charge: Charge | null;
  onClose: () => void;
};

const getStatusDetails = (status: CHARGE_STATUS | undefined) => {
  if (!status) return { label: "N/A", color: "text-foreground" };
  switch (status) {
    case CHARGE_STATUS.PAID:
      return { label: "Pago", color: "text-green-600" };
    case CHARGE_STATUS.PENDING:
      return { label: "Pendente", color: "text-orange-600" };
    case CHARGE_STATUS.OVERDUE:
      return { label: "Vencido", color: "text-red-600" };
    case CHARGE_STATUS.CANCELED:
      return { label: "Cancelado", color: "text-gray-500" };
    default:
      return { label: status, color: "text-foreground" };
  }
};

export function ChargeDetailModal({
  visible,
  charge,
  onClose,
}: ChargeDetailModalProps) {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? "light"].icon;
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const { addToast } = useToastStore();

  if (!charge) return null;

  const statusDetails = getStatusDetails(charge.status);
  const formattedDueDate = new Date(charge.dueDate).toLocaleDateString(
    "pt-BR",
    { timeZone: "UTC" }
  );
  const formattedPaidAt = charge.paidAt
    ? new Date(charge.paidAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "-";

  const handlePayPress = async () => {
    if (!charge) return;
    setIsLoadingCheckout(true);
    try {
      const response = await api.post<{ url: string }>(
        `/payment/charge/${charge.id}`,
        {}
      );
      const url = response.data.url;
      if (Platform.OS === "web") {
        window.location.href = url;
        await Linking.openURL(url);
        onClose();
      }
    } catch (error: any) {
      console.error("Erro ao criar checkout:", error);
      const message =
        error.response?.data?.message ||
        "Ocorreu um erro ao iniciar o pagamento. Tente novamente.";
      addToast(message, "error");
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const canPay =
    charge.status === CHARGE_STATUS.PENDING ||
    charge.status === CHARGE_STATUS.OVERDUE;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-5">
        <View className="w-full bg-card rounded-xl p-6 shadow-xl relative">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-3 right-3 p-1 z-10"
          >
            <Feather name="x" size={24} color={iconColor} />
          </TouchableOpacity>

          <ThemedText className="text-lg font-bold text-card-foreground mb-4 text-center">
            Detalhes da Cobrança
          </ThemedText>

          <View className="gap-3 mb-5">
            <View>
              <ThemedText type="labelInput" className="text-primary">
                Valor
              </ThemedText>
              <ThemedText className="text-xl font-semibold text-foreground">
                {formatCurrency(charge.amount)}
              </ThemedText>
            </View>
            <View>
              <ThemedText type="labelInput" className="text-primary">
                Vencimento
              </ThemedText>
              <ThemedText className="text-foreground">
                {formattedDueDate}
              </ThemedText>
            </View>
            <View>
              <ThemedText type="labelInput" className="text-primary">
                Status
              </ThemedText>
              <ThemedText className={`${statusDetails.color} font-semibold`}>
                {statusDetails.label}
              </ThemedText>
            </View>
            {charge.paidAt && (
              <View>
                <ThemedText type="labelInput" className="text-primary">
                  Pago em
                </ThemedText>
                <ThemedText className="text-foreground">
                  {formattedPaidAt}
                </ThemedText>
              </View>
            )}
          </View>

          {canPay && (
            <Button
              onPress={handlePayPress}
              disabled={isLoadingCheckout}
              title={isLoadingCheckout ? "Carregando..." : "Pagar com Stripe"}
            >
              {isLoadingCheckout && <ActivityIndicator />}
            </Button>
          )}

          <Button
            onPress={onClose}
            variant="outline"
            className="mt-3"
            title="Fechar"
          />
        </View>
      </View>
    </Modal>
  );
}
