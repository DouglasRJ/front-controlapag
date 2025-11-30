import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export type ButtonVariant =
  | "default"
  | "primary"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends PressableProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
}

const containerBase =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:opacity-80";

const containerVariants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  primary: "bg-primary-500 text-primary-foreground hover:bg-primary-600",
  destructive:
    "bg-error-500 text-white hover:bg-error-600 dark:hover:bg-error-600",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-secondary-500 text-secondary-foreground hover:bg-secondary-600",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const containerSizes: Record<ButtonSize, string> = {
  xs: "h-6 px-2 text-xs rounded-lg",
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-10 px-4 py-2 text-base rounded-lg",
  lg: "h-11 px-8 text-lg rounded-lg",
  icon: "h-10 w-10 rounded-lg",
};

const textVariants: Record<ButtonVariant, string> = {
  default: "text-primary-foreground",
  primary: "text-primary-foreground",
  destructive: "text-white",
  outline: "text-foreground",
  secondary: "text-secondary-foreground",
  ghost: "text-foreground",
  link: "text-primary",
};

export function Button({
  title,
  variant = "default",
  size = "md",
  className,
  children,
  ...pressableProps
}: ButtonProps) {
  const containerClass = cn(
    containerBase,
    containerVariants[variant],
    containerSizes[size],
    className
  );

  const textClass = cn(textVariants[variant]);

  const content = children || title;

  return (
    <Pressable className={containerClass} {...pressableProps}>
      {typeof content === "string" ? (
        <Text className={textClass}>{content}</Text>
      ) : (
        content
      )}
    </Pressable>
  );
}
