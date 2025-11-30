import React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "@/utils/cn";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "outline";

export interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-neutral-200 text-neutral-900 border-neutral-300",
  primary: "bg-primary-500 text-primary-foreground border-primary-600",
  secondary: "bg-secondary-500 text-secondary-foreground border-secondary-600",
  success: "bg-success-50 text-success-600 border-success-200",
  warning: "bg-warning-50 text-warning-600 border-warning-200",
  error: "bg-error-50 text-error-600 border-error-200",
  info: "bg-info-50 text-info-600 border-info-200",
  outline: "bg-transparent text-foreground border-border",
};

export function Badge({
  children,
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <View
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-xs font-semibold">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

