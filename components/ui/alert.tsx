import React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "@/utils/cn";

export type AlertVariant = "default" | "success" | "warning" | "error" | "info";

export interface AlertProps extends ViewProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const alertVariants: Record<AlertVariant, string> = {
  default: "bg-card border-border text-foreground",
  success: "bg-success-50 border-success-200 text-success-900",
  warning: "bg-warning-50 border-warning-200 text-warning-900",
  error: "bg-error-50 border-error-200 text-error-900",
  info: "bg-info-50 border-info-200 text-info-900",
};

export function Alert({
  children,
  variant = "default",
  className,
  ...props
}: AlertProps) {
  return (
    <View
      className={cn(
        "relative w-full rounded-lg border p-4",
        alertVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export interface AlertTitleProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertTitle({ children, className, ...props }: AlertTitleProps) {
  return (
    <Text
      className={cn("mb-1 text-base font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface AlertDescriptionProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDescription({
  children,
  className,
  ...props
}: AlertDescriptionProps) {
  return (
    <Text
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

