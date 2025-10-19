import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledSelect } from "@/components/forms/controlled-select";
import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { registerSchema } from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
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

const MAX_PROVIDER_STEPS = 5;
const MAX_CLIENT_STEPS = 4;

export default function RegisterScreen() {
  const { register } = useAuthStore();

  const linkColor = useThemeColor({}, "tint");

  const [currentStep, setCurrentStep] = useState(1);
  const [registerError, setRegisterError] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setError,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm({
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
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const maxSteps =
    role === USER_ROLE.PROVIDER ? MAX_PROVIDER_STEPS : MAX_CLIENT_STEPS;

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
    setRegisterError(null);
    let fieldsToValidate = [];
    let shouldProceed = true;

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["username", "email"];
        break;
      case 2:
        fieldsToValidate = ["password", "confirmPassword"];

        if (password !== confirmPassword) {
          setError("confirmPassword", {
            type: "manual",
            message: "As senhas não coincidem",
          });
          shouldProceed = false;
        } else {
          setError("confirmPassword", { type: "manual", message: undefined });
        }
        break;
      case 3:
        fieldsToValidate = ["role"];
        break;
      case 4:
        if (role === USER_ROLE.PROVIDER) {
          fieldsToValidate = [
            "providerProfile.title",
            "providerProfile.businessPhone",
            "providerProfile.address",
          ];
        } else if (role === USER_ROLE.CLIENT) {
          fieldsToValidate = ["clientProfile.phone", "clientProfile.address"];
        } else {
          shouldProceed = false;
        }
        break;
      case 5:
        if (role === USER_ROLE.PROVIDER) {
          fieldsToValidate = ["providerProfile.bio"];
        }
        break;
      default:
        return;
    }

    if (!shouldProceed) {
      return;
    }

    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid) {
      if (currentStep === MAX_CLIENT_STEPS && role === USER_ROLE.CLIENT) {
        handleFinalSubmit(getValues());
      } else if (currentStep < MAX_PROVIDER_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleFinalSubmit = handleSubmit(async (data) => {
    setRegisterError(null);

    let isStepFinalValid = true;
    if (role === USER_ROLE.PROVIDER && currentStep < MAX_PROVIDER_STEPS) {
      isStepFinalValid = await trigger(["providerProfile.bio"], {
        shouldFocus: true,
      });
    }

    if (!isStepFinalValid) {
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
    } catch (error) {
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
    if (currentStep === MAX_PROVIDER_STEPS && role === USER_ROLE.CLIENT) {
      setCurrentStep(MAX_CLIENT_STEPS);
    } else {
      setCurrentStep(currentStep - 1);
    }
    setRegisterError(null);
  };

  const Step1Content = (
    <>
      <ThemedText className="text-lg font-bold text-gray-800 mb-2 mt-1 flex-row items-center">
        <Ionicons
          name="person-circle-outline"
          size={20}
          color="#FF6B35"
          className="mr-2"
        />{" "}
        Identificação Básica
      </ThemedText>
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
    </>
  );

  const Step2Content = (
    <>
      <ThemedText className="text-lg font-bold text-gray-800 mb-2 mt-1 flex-row items-center">
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#FF6B35"
          className="mr-2"
        />{" "}
        Segurança da Conta
      </ThemedText>
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
    </>
  );

  const Step3Content = (
    <>
      <ThemedText className="text-lg font-bold text-gray-800 mb-2 mt-1 flex-row items-center">
        <Ionicons
          name="briefcase-outline"
          size={20}
          color="#FF6B35"
          className="mr-2"
        />{" "}
        Tipo de Conta
      </ThemedText>
      <ThemedText className="text-base font-semibold text-gray-800 mt-2 mb-1">
        Qual seu objetivo?
      </ThemedText>
      <ControlledSelect
        control={control}
        name="role"
        label="Tipo de Conta"
        options={userRoleOptions}
      />
    </>
  );

  const Step4ProviderContent = (
    <>
      <ThemedText className="text-lg font-bold text-gray-800 mb-2 mt-1 flex-row items-center">
        <Ionicons
          name="business-outline"
          size={20}
          color="#FF6B35"
          className="mr-2"
        />{" "}
        Detalhes do Prestador
      </ThemedText>
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
        name="providerProfile.address"
        label="Endereço"
        placeholder="Rua, número, bairro"
      />
    </>
  );

  const Step4ClientContent = (
    <>
      <ThemedText className="text-lg font-bold text-gray-800 mb-2 mt-1 flex-row items-center">
        <Ionicons
          name="person-circle-outline"
          size={20}
          color="#FF6B35"
          className="mr-2"
        />{" "}
        Detalhes do Cliente
      </ThemedText>
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

  const Step5Content = (
    <>
      <ThemedText className="text-lg font-bold text-gray-800 mb-2 mt-1 flex-row items-center">
        <Ionicons
          name="document-text-outline"
          size={20}
          color="#FF6B35"
          className="mr-2"
        />{" "}
        Sobre Você
      </ThemedText>
      <ControlledInput
        control={control}
        name="providerProfile.bio"
        label="Biografia / Sobre Você"
        placeholder="Descreva brevemente seus serviços e experiência"
        type="textarea"
        autoComplete="off"
      />
    </>
  );

  const currentMaxSteps =
    role === USER_ROLE.PROVIDER ? MAX_PROVIDER_STEPS : MAX_CLIENT_STEPS;

  const stepContents = [
    Step1Content,
    Step2Content,
    Step3Content,
    role === USER_ROLE.PROVIDER ? Step4ProviderContent : Step4ClientContent,
    role === USER_ROLE.PROVIDER ? Step5Content : null,
  ].filter((content) => content !== null);

  return (
    <ThemedView className="flex-1 justify-center items-center md:p-4">
      <LinearGradient
        colors={["#242120", "#2d2d2d", "#242120"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="hidden md:block absolute w-[250px] h-[250px] rounded-full bg-orange-500/5 top-[-80px] right-[-60px]" />
      <View className="hidden md:block absolute w-[180px] h-[180px] rounded-full bg-orange-500/5 bottom-[-40px] left-[-50px]" />
      <View className="hidden md:block absolute w-[120px] h-[120px] rounded-full bg-orange-500/5 top-[40%] left-[-30px]" />

      <View
        className={`
          w-full bg-card overflow-hidden flex-1 mb-12 
          md:max-w-xl rounded-3xl md:shadow-2xl md:elevation-10 md:max-h-[80%]
        `}
      >
        <View className="h-3 bg-primary" />

        <View className="items-center py-4 px-4 md:px-5 md:pt-6 md:pb-4">
          <View className="mb-4 w-9 h-9 rounded-lg bg-primary items-center justify-center">
            <MaterialIcons
              name="attach-money"
              size={20}
              className="text-white"
            />
          </View>
          <Logo fontSize={24} />
          <ThemedText className="my-3 text-sm text-gray-600 text-center leading-relaxed">
            Crie uma conta para gerenciar seus serviços
          </ThemedText>

          <View className="flex-row items-center mt-3 mb-1">
            {Array.from({ length: currentMaxSteps }).map((_, index) => (
              <React.Fragment key={index}>
                <View
                  className={`w-2.5 h-2.5 rounded-full ${currentStep >= index + 1 ? "bg-primary" : "bg-gray-200"}`}
                />
                {index < currentMaxSteps - 1 && (
                  <View className="w-4 h-0.5 bg-gray-200 mx-1.5" />
                )}
              </React.Fragment>
            ))}
          </View>

          <ThemedText className="text-xs text-gray-400 font-medium">
            Etapa {currentStep} de {currentMaxSteps}
          </ThemedText>
        </View>

        {registerError && (
          <View className="flex-row items-center bg-red-100 py-2 px-3 mx-4 mb-3 rounded-xl gap-2">
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <ThemedText className="flex-1 text-red-600 text-xs font-medium">
              {registerError}
            </ThemedText>
          </View>
        )}

        <ScrollView
          className="flex-1 px-4 md:px-5"
          contentContainerStyle={{ paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          {stepContents.map((Content, index) => (
            <View
              key={index}
              className={`gap-3 ${currentStep !== index + 1 ? "absolute h-0 opacity-0 overflow-hidden top-0 left-0 right-0 z-[-1]" : ""}`}
            >
              {Content}
            </View>
          ))}
        </ScrollView>

        <View className="px-4 py-4 md:px-5 md:pt-4 md:pb-5 border-t border-t-gray-100">
          <View className="flex-row gap-3 mb-3">
            {currentStep > 1 && (
              <Button
                title="VOLTAR"
                onPress={handlePreviousStep}
                variant="outline"
                size="md"
                className="flex-1"
              />
            )}

            {currentStep < currentMaxSteps && (
              <Button
                title="PRÓXIMO"
                onPress={handleNextStep}
                size="md"
                disabled={isSubmitting}
                className={`flex-1 ${currentStep > 1 ? "" : "w-full"}`}
              />
            )}

            {currentStep === currentMaxSteps && (
              <Button
                title={isSubmitting ? "CRIANDO..." : "FINALIZAR"}
                onPress={handleFinalSubmit}
                disabled={isSubmitting}
                size="md"
                className="flex-1"
              />
            )}
          </View>

          <View className="flex-row justify-center items-center">
            <ThemedText className="text-xs text-gray-600 font-normal">
              Já tem uma conta?{" "}
            </ThemedText>
            <Link href="/login" asChild>
              <Pressable>
                <ThemedText
                  style={{ color: linkColor }}
                  className="text-xs font-semibold underline"
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
