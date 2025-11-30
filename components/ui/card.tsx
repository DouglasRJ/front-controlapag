import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/utils/cn";

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-xl bg-card border border-border shadow-sm",
        "hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <View className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </View>
  );
}

export interface CardTitleProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <View className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </View>
  );
}

export interface CardDescriptionProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <View
      className={cn("text-sm text-foreground/60", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardContentProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <View className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </View>
  );
}

export interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <View
      className={cn("flex flex-row items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </View>
  );
}

