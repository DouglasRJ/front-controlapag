import { ControlledCheckbox } from "@/components/forms/controlled-checkbox";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { FontPoppins } from "@/constants/font";
import { paymentMethodOptions } from "@/constants/service-payment-methods";
import { useThemeColor } from "@/hooks/use-theme-color";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
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

  const cardColor = useThemeColor({}, "card");
  const iconColor = useThemeColor({}, "tint");
  const borderGrayColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "background");

  const styles = useMemo(
    () => getStyles({ cardColor, iconColor, borderGrayColor, textColor }),
    [iconColor, borderGrayColor, cardColor, textColor]
  );

  const isRecurrent = watch("isRecurrent");
  const hasFixedLocation = watch("hasFixedLocation");
  const hasFixedPrice = watch("hasFixedPrice");

  const handleCreateService = async (data: NewServiceFormData) => {
    console.log("Payload a ser enviado para a API:", data);
    try {
      await api.post("/service", {
        name: data.name,
        description: data.description,
        address: data.address,
        defaultPrice: +data.defaultPrice!,
        allowedPaymentMethods: data.allowedPaymentMethods,
      });
      router.replace("/(tabs)/(provider)/services");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/services");
    }
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <ScrollView
        style={{ width: "100%", paddingBottom: 80 }}
        contentContainerStyle={{ alignItems: "center" }}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Ionicons
            name="arrow-back"
            size={14}
            color={"#fff"}
            onPress={handleBack}
          />
          <ThemedText style={styles.title}>Novo Serviço</ThemedText>
        </View>
        <View style={styles.cards}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View>
                <ThemedText style={[styles.cardTitle]}>
                  Informações básicas
                </ThemedText>
              </View>
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

          <View style={styles.card}>
            <View style={styles.header}>
              <View>
                <ThemedText style={[styles.cardTitle]}>Localidade</ThemedText>
              </View>
            </View>
            <ControlledCheckbox
              control={control}
              name="hasFixedLocation"
              label="Local fixo?"
            />
            {!hasFixedLocation && (
              <ControlledInput
                control={control}
                name="address"
                placeholder="Endereço do local"
              />
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.header}>
              <View>
                <ThemedText style={[styles.cardTitle]}>Preços</ThemedText>
              </View>
            </View>
            <ControlledCheckbox
              control={control}
              name="hasFixedPrice"
              label="Preço fixo?"
            />
            {!hasFixedPrice && (
              <ControlledInput
                control={control}
                name="defaultPrice"
                label="Preço (R$)"
                placeholder="500,00"
                keyboardType="numeric"
              />
            )}
            <ControlledSelect
              control={control}
              name="allowedPaymentMethods"
              label="Métodos de pagamento permitidos"
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
              />
            )}
          </View>

          <Button
            title={isSubmitting ? "Salvando..." : "Salvar Serviço"}
            onPress={handleSubmit(handleCreateService)}
            disabled={isSubmitting}
            size="lg"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const getStyles = (colors: {
  cardColor: string;
  iconColor: string;
  borderGrayColor: string;
  textColor: string;
}) =>
  StyleSheet.create({
    cards: {
      width: "90%",
      gap: 20,
    },
    cardTitle: {
      fontSize: 16,
      fontFamily: FontPoppins.SEMIBOLD,
      color: colors.textColor,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    pageContainer: {
      flex: 1,
      flexGrow: 1,
      alignItems: "center",
      paddingTop: 20,
      width: "100%",
    },
    container: {
      alignItems: "center",
      padding: 20,
      width: "100%",
      gap: 8,
      flexDirection: "row",
    },
    contentWrapper: {
      padding: 20,
      backgroundColor: "#333333",
      borderRadius: 10,
      alignItems: "center",
    },
    title: {
      fontFamily: FontPoppins.SEMIBOLD,
      fontSize: 16,
      alignSelf: "flex-start",
    },
    scrollContainer: {
      width: "100%",
      flex: 1,
    },
    card: {
      width: "100%",
      padding: 14,
      borderRadius: 12,
      marginBottom: 16,
      justifyContent: "space-between",
      minHeight: 60,
      gap: 8,
      backgroundColor: colors.cardColor,
    },
  });
