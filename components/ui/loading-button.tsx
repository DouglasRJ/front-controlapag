import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { Button, ButtonProps } from "./button";
import { cn } from "@/utils/cn";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  title,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  const content = loading ? (
    <View className="flex-row items-center justify-center gap-2">
      <ActivityIndicator size="small" color="white" />
      {loadingText && (
        <Text className="text-white">{loadingText}</Text>
      )}
    </View>
  ) : (
    children || title
  );

  return (
    <Button
      disabled={disabled || loading}
      title={typeof content === "string" ? content : undefined}
      className={cn(loading && "opacity-70", className)}
      {...props}
    >
      {typeof content !== "string" ? content : undefined}
    </Button>
  );
}

