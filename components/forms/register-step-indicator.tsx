import React, { useMemo } from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";

type RegisterStepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    number: number;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
  }>;
};

export function RegisterStepIndicator({
  currentStep,
  totalSteps,
  steps,
}: RegisterStepIndicatorProps) {
  // Memoiza os steps para evitar recálculos
  const stepItems = useMemo(
    () =>
      steps.map((step) => ({
        ...step,
        isActive: currentStep >= step.number,
        isCurrent: currentStep === step.number,
      })),
    [steps, currentStep]
  );

  const progressPercentage = useMemo(
    () => (currentStep / totalSteps) * 100,
    [currentStep, totalSteps]
  );

  return (
    <View className="mb-4">
      {/* Progress Bar */}
      <View className="mb-3">
        <View className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
        <View className="flex-row items-center justify-between mt-1.5">
          <ThemedText className="text-xs text-gray-500 font-medium">
            Etapa {currentStep} de {totalSteps}
          </ThemedText>
          <ThemedText className="text-xs text-gray-500 font-medium">
            {Math.round((currentStep / totalSteps) * 100)}%
          </ThemedText>
        </View>
      </View>

      {/* Step Indicators - Design Compacto */}
      <View className="flex-row items-center justify-between">
        {stepItems.map((step, index) => {
          return (
            <React.Fragment key={step.number}>
              <View className="items-center flex-1">
                <View
                  className={`h-8 w-8 rounded-full items-center justify-center ${
                    step.isActive
                      ? "bg-primary"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {step.isActive ? (
                    <Ionicons
                      name={step.icon}
                      size={16}
                      color={step.isActive ? "white" : "#9CA3AF"}
                    />
                  ) : (
                    <ThemedText
                      className={`text-xs font-semibold ${
                        step.isActive
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.number}
                    </ThemedText>
                  )}
                </View>
              </View>
              {index < stepItems.length - 1 && (
                <View
                  className={`h-0.5 flex-1 mx-1 ${
                    currentStep > step.number
                      ? "bg-primary"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      
      {/* Título do Step Atual - Compacto */}
      <View className="mt-2">
        <ThemedText className="text-sm font-semibold text-primary text-center">
          {stepItems.find(s => s.isCurrent)?.title || ""}
        </ThemedText>
      </View>
    </View>
  );
}

