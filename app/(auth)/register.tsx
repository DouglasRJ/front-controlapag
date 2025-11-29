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
import { isProviderRole } from "@/utils/user-role";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

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
  const { register, user } = useAuthStore();

  const linkColor = useThemeColor({}, "tint");

  const [currentStep, setCurrentStep] = useState(1);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (user?.role === USER_ROLE.CLIENT) {
      router.replace("/(tabs)/(client)/enrollments");
    } else if (isProviderRole(user?.role)) {
      router.replace("/(tabs)/(provider)/services");
    }
  }, [user]);

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
      <ThemedText className="text-base font-bold text-gray-800 mb-3">
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
      <ThemedText className="text-base font-bold text-gray-800 mb-3">
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
      <ThemedText className="text-base font-bold text-gray-800 mb-3">
        Tipo de Conta
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
      <ThemedText className="text-base font-bold text-gray-800 mb-3">
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
      <ThemedText className="text-base font-bold text-gray-800 mb-3">
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
      <ThemedText className="text-base font-bold text-gray-800 mb-3">
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
    <ThemedView className="flex-1">
      <LinearGradient
        colors={["#242120", "#2d2d2d", "#242120"]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <View className="flex-1 md:flex-row md:max-w-6xl md:mx-auto md:w-full">
            <View className="hidden md:flex md:flex-1 md:justify-center md:items-center md:p-12 md:relative">
              <View className="absolute w-[300px] h-[300px] rounded-full bg-orange-500/10 top-[-100px] right-[-80px]" />
              <View className="absolute w-[200px] h-[200px] rounded-full bg-orange-500/5 bottom-[-60px] left-[-40px]" />

              <View className="relative z-10 max-w-md">
                <Logo fontSize={36} />

                <ThemedText className="mt-6 text-2xl font-bold text-white leading-tight">
                  Comece a gerenciar seus negócios hoje
                </ThemedText>

                <ThemedText className="mt-4 text-base text-gray-300 leading-relaxed">
                  Crie sua conta e tenha acesso a todas as ferramentas para
                  organizar seus serviços e pagamentos.
                </ThemedText>

                <View className="mt-8 gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Cadastro rápido e intuitivo
                    </ThemedText>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Para prestadores e clientes
                    </ThemedText>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange-500/20 items-center justify-center">
                      <Ionicons name="checkmark" size={20} color="#FF6B35" />
                    </View>
                    <ThemedText className="flex-1 text-gray-200">
                      Totalmente gratuito para começar
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-1 md:flex md:justify-center md:items-center md:p-8">
              <View className="w-full md:max-w-md bg-card md:rounded-3xl md:shadow-2xl overflow-hidden min-h-full md:min-h-[650px] md:flex md:flex-col">
                <View className="h-2 bg-primary md:hidden" />

                <View className="flex-1 px-6 pt-12 pb-6 md:pt-8 md:pb-6 md:flex md:flex-col md:justify-between">
                  <View>
                    <View className="items-center mb-6">
                      <View className="mb-3 w-12 h-12 rounded-2xl bg-primary items-center justify-center shadow-lg md:hidden">
                        <MaterialIcons
                          name="attach-money"
                          size={24}
                          color="white"
                        />
                      </View>
                      <View className="md:hidden">
                        <Logo fontSize={26} />
                      </View>
                      <ThemedText className="mt-2 text-xl font-bold text-card-foreground md:text-2xl md:mt-0">
                        Criar nova conta
                      </ThemedText>
                      <ThemedText className="mt-2 text-sm text-gray-500 text-center">
                        Preencha os dados abaixo para começar
                      </ThemedText>

                      <View className="flex-row items-center mt-5 mb-1">
                        {Array.from({ length: currentMaxSteps }).map(
                          (_, index) => (
                            <React.Fragment key={index}>
                              <View
                                className={`w-2 h-2 rounded-full ${currentStep >= index + 1 ? "bg-primary" : "bg-gray-300"}`}
                              />
                              {index < currentMaxSteps - 1 && (
                                <View className="w-3 h-0.5 bg-gray-300 mx-1" />
                              )}
                            </React.Fragment>
                          )
                        )}
                      </View>

                      <ThemedText className="text-xs text-gray-400 font-medium">
                        Etapa {currentStep} de {currentMaxSteps}
                      </ThemedText>
                    </View>

                    {registerError && (
                      <View className="flex-row items-center bg-red-50 py-3 px-4 mb-2 rounded-xl gap-2 border border-red-200">
                        <Ionicons
                          name="alert-circle"
                          size={18}
                          color="#DC2626"
                        />
                        <ThemedText className="flex-1 text-red-600 text-sm font-medium">
                          {registerError}
                        </ThemedText>
                      </View>
                    )}

                    <View className="min-h-[280px]">
                      {stepContents.map((Content, index) => (
                        <View
                          key={index}
                          className={`gap-3 ${currentStep !== index + 1 ? "absolute h-0 opacity-0 overflow-hidden top-0 left-0 right-0 -z-10" : ""}`}
                        >
                          {Content}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View className="px-6 pb-8 pt-4 md:pb-10 border-t border-t-gray-100">
                  <View className="flex-row gap-3 mb-4">
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
                        className={currentStep > 1 ? "flex-1" : "w-full"}
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
                    <ThemedText className="text-sm text-gray-500">
                      Já tem uma conta?{" "}
                    </ThemedText>
                    <Link href="/login" asChild>
                      <Pressable>
                        <ThemedText
                          style={{ color: linkColor }}
                          className="text-sm font-bold"
                        >
                          Faça login
                        </ThemedText>
                      </Pressable>
                    </Link>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
