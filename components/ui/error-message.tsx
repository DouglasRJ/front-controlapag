import React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/utils/cn";

export interface ErrorMessageProps extends ViewProps {
  message: string;
  className?: string;
  textClassName?: string;
  showIcon?: boolean;
}

export function ErrorMessage({
  message,
  className,
  textClassName,
  showIcon = true,
  ...props
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <View
      className={cn("flex-row items-center gap-2 mt-1", className)}
      {...props}
    >
      {showIcon && (
        <Ionicons name="alert-circle" size={16} className="text-error-500" />
      )}
      <Text className={cn("text-xs text-error-600 dark:text-error-400", textClassName)}>
        {message}
      </Text>
    </View>
  );
}

