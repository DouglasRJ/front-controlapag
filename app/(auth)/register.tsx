import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledPicker } from "@/components/forms/controlled-picker";
import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import { RegisterData, registerSchema } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

const userRoleOptions = [
  { label: "Prestador de Serviço", value: USER_ROLE.PROVIDER },
  { label: "Cliente", value: USER_ROLE.CLIENT },
];

const initialProviderProfile = {
  title: "",
  bio: "",
  businessPhone: "",
  address: "",
};
const initialClientProfile = { phone: "", address: "" };

export default function RegisterScreen() {
  const { register } = useAuthStore();

  const cardBackgroundColor = useThemeColor({}, "card");
  const bgColor = useThemeColor({}, "background");
  const linkColor = useThemeColor({}, "tint");

  const [currentStep, setCurrentStep] = useState(1);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setError,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      role: undefined,
      providerProfile: undefined,
      clientProfile: undefined,
    },
    mode: "onBlur",
  });

  const role = watch("role");

  useEffect(() => {
    if (role === USER_ROLE.PROVIDER) {
      setValue("clientProfile", undefined);
      if (!getValues("providerProfile")) {
        setValue("providerProfile", initialProviderProfile);
      }
    } else if (role === USER_ROLE.CLIENT) {
      setValue("providerProfile", undefined);
      if (!getValues("clientProfile")) {
        setValue("clientProfile", initialClientProfile);
      }
    }
  }, [role, setValue, getValues]);

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof RegisterData)[] = [
      "username",
      "email",
      "password",
      "confirmPassword",
      "role",
    ];

    console.log("getValues", getValues());

    const isValid = await trigger(fieldsToValidate as any, {
      shouldFocus: true,
    });

    if (isValid) {
      setCurrentStep(currentStep + 1);
      setRegisterError(null);
    }
  };

  const handleFinalSubmit = handleSubmit(async (data: RegisterData) => {
    setRegisterError(null);
    let fieldsToValidateStep2: (keyof RegisterData)[] = [];

    if (data.role === USER_ROLE.PROVIDER) {
      fieldsToValidateStep2 = [
        "providerProfile.title",
        "providerProfile.businessPhone",
        "providerProfile.bio",
        "providerProfile.address",
      ] as any;
    } else if (data.role === USER_ROLE.CLIENT) {
      fieldsToValidateStep2 = [
        "clientProfile.phone",
        "clientProfile.address",
      ] as any;
    }

    const isStep2Valid = await trigger(fieldsToValidateStep2, {
      shouldFocus: true,
    });
    if (!isStep2Valid) {
      return;
    }

    try {
      const dataToSend = { ...data };
      if (data.role === USER_ROLE.PROVIDER) {
        delete dataToSend.clientProfile;
      } else if (data.role === USER_ROLE.CLIENT) {
        delete dataToSend.providerProfile;
      }

      await register(dataToSend);
    } catch (error: any) {
      const errorMessage = error.message;

      if (errorMessage === "Este email já está em uso.") {
        setError(
          "email",
          { type: "manual", message: errorMessage },
          { shouldFocus: true }
        );
        setCurrentStep(1);
      } else {
        setRegisterError(errorMessage);
      }
    }
  });

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setRegisterError(null);
  };

  const Step1Content = (
    <>
      <ControlledInput
        control={control}
        name="username"
        label="Nome de Usuário"
        placeholder="Seu nome completo"
        autoComplete="off"
      />
      <ControlledInput
        control={control}
        name="email"
        label="Email"
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="off"
      />
      <ControlledInput
        control={control}
        name="password"
        label="Senha"
        placeholder="********"
        secureTextEntry
        autoComplete="off"
      />
      <ControlledInput
        control={control}
        name="confirmPassword"
        label="Confirmar Senha"
        placeholder="********"
        secureTextEntry
        autoComplete="off"
      />
      <ControlledPicker
        control={control}
        name="role"
        label="Tipo de Conta"
        options={userRoleOptions}
      />
    </>
  );

  const Step2ProviderContent = (
    <>
      <ThemedText style={styles.sectionTitle}>Detalhes do Prestador</ThemedText>
      <ControlledInput
        control={control}
        name="providerProfile.title"
        label="Título do Serviço"
        placeholder="Desenvolvedor Web, Coach Fitness, etc."
        autoComplete="off"
      />
      <ControlledInput
        control={control}
        name="providerProfile.businessPhone"
        label="Telefone Comercial"
        placeholder="(99) 99999-9999"
        keyboardType="phone-pad"
        autoComplete="off"
        maskType="phone"
      />
      <ControlledInput
        control={control}
        name="providerProfile.bio"
        label="Biografia / Sobre Você"
        placeholder="Descreva brevemente seus serviços"
        type="textarea"
        autoComplete="off"
      />

      <ControlledInput
        control={control}
        name="providerProfile.address"
        label="Endereço"
        placeholder="Rua, número, bairro"
      />
    </>
  );

  const Step2ClientContent = (
    <>
      <ThemedText style={styles.sectionTitle}>Detalhes do Cliente</ThemedText>
      <ControlledInput
        control={control}
        name="clientProfile.phone"
        label="Telefone Pessoal"
        placeholder="(99) 99999-9999"
        keyboardType="phone-pad"
        maskType="phone"
      />
      <ControlledInput
        control={control}
        name="clientProfile.address"
        label="Endereço"
        placeholder="Rua, número, bairro"
      />
    </>
  );

  const selectedRole = getValues("role");

  const selectedProfileContent =
    selectedRole === USER_ROLE.PROVIDER
      ? Step2ProviderContent
      : Step2ClientContent;

  return (
    <ThemedView style={styles.pageContainer}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        <View style={styles.header}>
          <Logo fontSize={36} />
          <ThemedText style={styles.subtitle}>
            Crie uma conta para gerenciar seus serviços
          </ThemedText>
          <ThemedText style={styles.stepIndicator}>
            Etapa {currentStep} de 2
          </ThemedText>
        </View>

        {registerError && (
          <View style={styles.errorBox}>
            <ThemedText style={styles.errorTextInternal}>
              {registerError}
            </ThemedText>
          </View>
        )}

        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
        >
          <View
            style={[styles.stepContainer, currentStep !== 1 && styles.hidden]}
          >
            {Step1Content}
          </View>

          <View
            style={[styles.stepContainer, currentStep !== 2 && styles.hidden]}
          >
            {selectedProfileContent}
          </View>
        </ScrollView>

        <View style={styles.actionsContainer}>
          {currentStep > 1 && (
            <Button
              title="VOLTAR"
              onPress={handlePreviousStep}
              variant="outline"
              size="md"
              style={{ marginBottom: 10 }}
            />
          )}

          {currentStep === 1 && (
            <Button
              title="PRÓXIMO"
              onPress={handleNextStep}
              size="md"
              disabled={isSubmitting}
            />
          )}

          {currentStep === 2 && (
            <Button
              title={isSubmitting ? "CRIANDO CONTA..." : "FINALIZAR CADASTRO"}
              onPress={handleFinalSubmit}
              disabled={isSubmitting}
              size="md"
            />
          )}

          <View style={styles.footer}>
            <ThemedText style={[styles.linkText, { color: bgColor }]}>
              Já tem uma conta?{" "}
            </ThemedText>
            <Link href="/login" asChild>
              <Pressable>
                <ThemedText
                  style={[
                    styles.linkText,
                    { color: linkColor, textDecorationLine: "underline" },
                  ]}
                >
                  Faça login
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    height: "70%",
    width: "100%",
    maxWidth: 520,
    borderRadius: 16,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 25,
    gap: 10,
  },
  header: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: FontPoppins.MEDIUM,
  },
  stepIndicator: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  formContainer: {
    gap: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkText: {
    fontSize: 12,
    fontFamily: FontPoppins.MEDIUM,
  },
  actionsContainer: {
    gap: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F87171",
  },
  errorTextInternal: {
    color: "#B91C1C",
    textAlign: "center",
    fontFamily: FontPoppins.MEDIUM,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontPoppins.SEMIBOLD,
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  hidden: {
    position: "absolute",
    height: 0,
    opacity: 0,
    overflow: "hidden",
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  formScroll: {
    flex: 1,
    marginVertical: 10,
  },
  formContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  stepContainer: {
    paddingTop: 10,
    gap: 10,
  },
});
