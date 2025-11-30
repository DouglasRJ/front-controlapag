import React from "react";
import { View, type ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../themed-text";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { cn } from "@/utils/cn";

export interface ErrorStateProps extends ViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: "default" | "compact" | "inline";
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  message = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
  variant = "default",
  icon = "alert-circle-outline",
  className,
  ...props
}: ErrorStateProps) {
  const iconSize = variant === "compact" ? 32 : variant === "inline" ? 20 : 48;

  if (variant === "inline") {
    return (
      <Alert variant="error" className={cn("my-2", className)} {...props}>
        <View className="flex-row items-start gap-3">
          <Ionicons name={icon} size={iconSize} className="text-error-600 mt-0.5" />
          <View className="flex-1">
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{message}</AlertDescription>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                title={retryLabel}
                onPress={onRetry}
                className="mt-3"
              />
            )}
          </View>
        </View>
      </Alert>
    );
  }

  if (variant === "compact") {
    return (
      <View
        className={cn("items-center justify-center p-4 gap-2", className)}
        {...props}
      >
        <Ionicons name={icon} size={iconSize} className="text-error-500" />
        <ThemedText className="text-sm text-foreground/80 text-center">
          {message}
        </ThemedText>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            title={retryLabel}
            onPress={onRetry}
          />
        )}
      </View>
    );
  }

  return (
    <View
      className={cn("flex-1 items-center justify-center p-6 gap-4", className)}
      {...props}
    >
      <Ionicons name={icon} size={iconSize} className="text-error-500" />
      <View className="items-center gap-2">
        <ThemedText className="text-lg font-semibold text-foreground text-center">
          {title}
        </ThemedText>
        <ThemedText className="text-sm text-foreground/60 text-center max-w-sm">
          {message}
        </ThemedText>
      </View>
      {onRetry && (
        <Button title={retryLabel} onPress={onRetry} className="mt-2" />
      )}
    </View>
  );
}

