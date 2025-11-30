import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemedText } from "@/components/themed-text";
import { useChargeRefund } from "@/hooks/use-charge-refund";
import { Charge } from "@/types/charge";
import { formatCurrency } from "@/utils/format-currency";
import { parseCurrency } from "@/utils/parse-currency";
import { Ionicons } from "@expo/vector-icons";

interface RefundModalProps {
  charge: Charge;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RefundModal({ charge, open, onOpenChange, onSuccess }: RefundModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const refundMutation = useChargeRefund();

  const chargeAmount = charge.amount;
  const refundedAmount = charge.refundedAmount || 0;
  const availableToRefund = chargeAmount - refundedAmount;

  const handleRefund = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Erro", "Por favor, informe um valor válido para o reembolso.");
      return;
    }

    const refundValue = parseCurrency(amount);
    
    if (refundValue > availableToRefund) {
      Alert.alert(
        "Erro",
        `O valor do reembolso não pode ser maior que ${formatCurrency(availableToRefund)}.`
      );
      return;
    }

    try {
      await refundMutation.mutateAsync({
        chargeId: charge.id,
        amount: refundValue,
        reason: reason || undefined,
      });

      Alert.alert("Sucesso", "Reembolso processado com sucesso!");
      setAmount("");
      setReason("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Não foi possível processar o reembolso."
      );
    }
  };

  const handleFullRefund = () => {
    setAmount(formatCurrency(availableToRefund).replace(/[^\d,.-]/g, "").replace(",", "."));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <ThemedText className="text-xl font-bold">Processar Reembolso</ThemedText>
          </DialogTitle>
          <DialogDescription>
            <ThemedText className="text-sm text-foreground/60">
              Reembolse total ou parcialmente esta cobrança
            </ThemedText>
          </DialogDescription>
        </DialogHeader>

        <View className="gap-4 mt-4">
          {/* Charge Info */}
          <View className="p-4 rounded-lg bg-muted/30 border border-border">
            <View className="flex-row items-center justify-between mb-2">
              <ThemedText className="text-sm text-foreground/60">Valor da Cobrança</ThemedText>
              <ThemedText className="text-base font-semibold">{formatCurrency(chargeAmount)}</ThemedText>
            </View>
            {refundedAmount > 0 && (
              <View className="flex-row items-center justify-between mb-2">
                <ThemedText className="text-sm text-foreground/60">Já Reembolsado</ThemedText>
                <ThemedText className="text-base font-semibold text-warning-600">
                  {formatCurrency(refundedAmount)}
                </ThemedText>
              </View>
            )}
            <View className="flex-row items-center justify-between pt-2 border-t border-border">
              <ThemedText className="text-sm font-medium">Disponível para Reembolso</ThemedText>
              <ThemedText className="text-lg font-bold text-primary">
                {formatCurrency(availableToRefund)}
              </ThemedText>
            </View>
          </View>

          {/* Amount Input */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <ThemedText className="text-sm font-medium">Valor do Reembolso</ThemedText>
              <Button
                variant="outline"
                size="sm"
                onPress={handleFullRefund}
                className="h-8"
              >
                <ThemedText className="text-xs">Reembolso Total</ThemedText>
              </Button>
            </View>
            <Input
              placeholder={formatCurrency(availableToRefund)}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              className="w-full"
            />
            <ThemedText className="text-xs text-foreground/60">
              Máximo: {formatCurrency(availableToRefund)}
            </ThemedText>
          </View>

          {/* Reason Input */}
          <View className="gap-2">
            <ThemedText className="text-sm font-medium">Motivo (Opcional)</ThemedText>
            <Textarea
              placeholder="Descreva o motivo do reembolso..."
              value={reason}
              onChangeText={setReason}
              numberOfLines={3}
              className="min-h-[80px]"
            />
          </View>

          {/* Preview */}
          {amount && parseCurrency(amount) > 0 && (
            <View className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="information-circle-outline" size={20} className="text-primary" />
                <ThemedText className="text-sm font-medium text-primary">Preview do Reembolso</ThemedText>
              </View>
              <View className="gap-1">
                <View className="flex-row items-center justify-between">
                  <ThemedText className="text-sm text-foreground/60">Valor a reembolsar</ThemedText>
                  <ThemedText className="text-base font-semibold">
                    {formatCurrency(parseCurrency(amount))}
                  </ThemedText>
                </View>
                {parseCurrency(amount) < availableToRefund && (
                  <View className="flex-row items-center justify-between">
                    <ThemedText className="text-sm text-foreground/60">Restante</ThemedText>
                    <ThemedText className="text-sm">
                      {formatCurrency(availableToRefund - parseCurrency(amount))}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onPress={() => {
              setAmount("");
              setReason("");
              onOpenChange(false);
            }}
            disabled={refundMutation.isPending}
          >
            <ThemedText>Cancelar</ThemedText>
          </Button>
          <Button
            onPress={handleRefund}
            disabled={refundMutation.isPending || !amount || parseCurrency(amount) <= 0}
            className="bg-primary"
          >
            {refundMutation.isPending ? (
              <ThemedText>Processando...</ThemedText>
            ) : (
              <ThemedText>Confirmar Reembolso</ThemedText>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

