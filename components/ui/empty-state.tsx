import React from "react";
import { View, type ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../themed-text";
import { Button } from "./button";
import { cn } from "@/utils/cn";

export interface EmptyStateProps extends ViewProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = "document-outline",
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <View
      className={cn("items-center justify-center p-8 gap-4", className)}
      {...props}
    >
      <Ionicons
        name={icon}
        size={64}
        className="text-foreground/20"
      />
      <View className="items-center gap-2">
        <ThemedText className="text-lg font-semibold text-foreground text-center">
          {title}
        </ThemedText>
        {description && (
          <ThemedText className="text-sm text-foreground/60 text-center max-w-sm">
            {description}
          </ThemedText>
        )}
      </View>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} className="mt-2" />
      )}
    </View>
  );
}

