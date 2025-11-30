import React from "react";
import { View, ActivityIndicator, type ViewProps } from "react-native";
import { ThemedText } from "../themed-text";
import { cn } from "@/utils/cn";

export interface LoadingSpinnerProps extends ViewProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: "small",
  md: "small",
  lg: "large",
} as const;

export function LoadingSpinner({
  size = "md",
  message,
  className,
  color,
  ...props
}: LoadingSpinnerProps) {
  return (
    <View
      className={cn("items-center justify-center gap-3", className)}
      {...props}
    >
      <ActivityIndicator
        size={sizeMap[size]}
        color={color}
        className="text-primary"
      />
      {message && (
        <ThemedText className="text-sm text-foreground/60 text-center">
          {message}
        </ThemedText>
      )}
    </View>
  );
}

