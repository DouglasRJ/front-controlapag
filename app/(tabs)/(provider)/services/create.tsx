import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { paymentMethodOptions } from "@/constants/service-payment-methods";
import { useCreateService } from "@/hooks/use-services";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { z } from "zod";

const newServiceSchema = z
  .object({
    name: z.string().min(1, "Por favor, preencha o nome do serviço."),
    allowedPaymentMethods: z
      .array(z.string())
      .nonempty({ message: "Selecione pelo menos um método de pagamento." }),
    description: z.string().optional(),
    isRecurrent: z.boolean().optional(),
    hasFixedLocation: z.boolean().optional(),
    address: z.string().optional(),
    hasFixedPrice: z.boolean().optional(),
    defaultPrice: z.string().optional(),
    recurrence: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.hasFixedLocation &&
      (!data.address || data.address.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O endereço deve ser preenchido.",
        path: ["address"],
      });
    }
    if (
      data.hasFixedPrice &&
      (!data.defaultPrice || data.defaultPrice.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O preço deve ser preenchido.",
        path: ["defaultPrice"],
      });
    }
    if (data.isRecurrent && (!data.recurrence || data.recurrence === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A recorrência deve ser selecionada.",
        path: ["recurrence"],
      });
    }
  });

type NewServiceFormData = z.infer<typeof newServiceSchema>;

export default function CreateServiceScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<NewServiceFormData>({
    resolver: zodResolver(newServiceSchema),
    defaultValues: {
      isRecurrent: false,
      hasFixedLocation: false,
      hasFixedPrice: false,
      allowedPaymentMethods: ["PIX", "CREDIT_CARD", "CASH"],
      name: "",
      description: "",
      address: "",
      defaultPrice: "",
      recurrence: "",
    },
  });

  const isRecurrent = watch("isRecurrent");
  const hasFixedLocation = watch("hasFixedLocation");
  const hasFixedPrice = watch("hasFixedPrice");

  const createServiceMutation = useCreateService();

  const handleCreateService = async (data: NewServiceFormData) => {
    console.log("Payload a ser enviado para a API:", data);
    try {
      const service = await createServiceMutation.mutateAsync(data);
      router.replace(`/(tabs)/(provider)/services/${service.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/(provider)/services");
    }
  };

  return (
    <ThemedView className="flex-1 grow items-center pt-5 w-full bg-background">
      <ScrollView
        className="w-full"
        contentContainerClassName="items-center pb-20"
        showsHorizontalScrollIndicator={false}
      >
        <View className="flex-row items-center p-5 w-full gap-2">
          <Ionicons
            name="arrow-back"
            size={24}
            className="text-foreground"
            onPress={handleBack}
          />
          <ThemedText className="font-semibold text-lg text-foreground self-start">
            Novo Serviço
          </ThemedText>
        </View>

        <View className="w-11/12 gap-5">
          <View className="w-full p-4 rounded-xl gap-3 bg-card shadow-sm min-h-[60px]">
            <View className="flex-row items-center justify-between mb-2">
              <ThemedText className="text-base font-semibold text-card-foreground">
                Informações básicas
              </ThemedText>
            </View>
            <ControlledInput
              control={control}
              name="name"
              label="Nome"
              placeholder="Ex: Transporte Ida e Volta"
            />
            <ControlledInput
              control={control}
              name="description"
              label="Descrição"
              placeholder="Ex: Transporte de clientes..."
              multiline
              numberOfLines={4}
            />
            <ControlledCheckbox
              control={control}
              name="isRecurrent"
              label="É um serviço recorrente?"
            />
          </View>

          <View className="w-full p-4 rounded-xl gap-3 bg-card shadow-sm min-h-[60px]">
            <View className="flex-row items-center justify-between mb-2">
              <ThemedText className="text-base font-semibold text-card-foreground">
                Localidade Padrão
              </ThemedText>
            </View>
            <ControlledCheckbox
              control={control}
              name="hasFixedLocation"
              label="Possui local fixo padrão?"
            />
            {hasFixedLocation && (
              <ControlledInput
                control={control}
                name="address"
                label="Endereço Padrão"
                placeholder="Endereço onde o serviço ocorre"
              />
            )}
            {!hasFixedLocation && (
              <ThemedText className="text-sm font-medium opacity-70 text-muted-foreground mt-1">
                Localidade variável ou definida por contrato.
              </ThemedText>
            )}
          </View>

          <View className="w-full p-4 rounded-xl gap-3 bg-card shadow-sm min-h-[60px]">
            <View className="flex-row items-center justify-between mb-2">
              <ThemedText className="text-base font-semibold text-card-foreground">
                Preços e Pagamentos Padrão
              </ThemedText>
            </View>
            <ControlledCheckbox
              control={control}
              name="hasFixedPrice"
              label="Possui preço padrão?"
            />
            {hasFixedPrice && (
              <ControlledInput
                control={control}
                name="defaultPrice"
                label="Preço Padrão (R$)"
                placeholder="500,00"
                keyboardType="numeric"
              />
            )}
            {!hasFixedPrice && (
              <ThemedText className="text-sm font-medium opacity-70 text-muted-foreground mt-1">
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
            />
            {isRecurrent && (
              <ControlledSelect
                control={control}
                name="recurrence"
                label="Recorrência do pagamento"
                options={[
                  { label: "Mensalmente", value: "monthly" },
                  { label: "Data do serviço", value: "service_date" },
                  { label: "Personalizado", value: "custom" },
                ]}
                placeholder="Selecione a recorrência"
              />
            )}
          </View>

          <Button
            title={
              isSubmitting || createServiceMutation.isPending
                ? "Salvando..."
                : "Salvar Serviço"
            }
            onPress={handleSubmit(handleCreateService)}
            disabled={isSubmitting || createServiceMutation.isPending}
            size="lg"
            className="mt-4 z-[-1]"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
