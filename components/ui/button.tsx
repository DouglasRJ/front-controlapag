import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";

type ButtonVariant = "default" | "primary" | "destructive" | "outline" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg";

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & PressableProps;

const containerBase =
  "items-center justify-center flex-row active:opacity-80 disabled:opacity-50";

const containerVariants: Record<ButtonVariant, string> = {
  default: "bg-primary",
  primary: "bg-foreground",
  destructive: "bg-destructive",
  outline: "bg-transparent border border-primary",
  link: "bg-transparent",
};

const containerSizes: Record<ButtonSize, string> = {
  xs: "h-6 px-2 rounded-md",
  sm: "py-2 px-4 rounded-md",
  md: "py-2.5 px-2.5 rounded-md",
  lg: "py-3.5 px-8 rounded-[10px]",
};

const textBase = "text-sm font-regular text-center";

const textVariants: Record<ButtonVariant, string> = {
  default: "text-white",
  primary: "text-background",
  destructive: "text-white",
  outline: "text-primary",
  link: "text-primary underline",
};

const textSizes: Record<ButtonSize, string> = {
  xs: "text-[10px] font-medium",
  sm: "text-sm",
  md: "text-[10px] font-bold",
  lg: "text-lg uppercase",
};

export function Button({
  title,
  variant = "default",
  size = "md",
  className,
  ...pressableProps
}: ButtonProps) {
  const containerClass = [
    containerBase,
    containerVariants[variant],
    containerSizes[size],
    className,
  ].join(" ");

  const textClass = [textBase, textVariants[variant], textSizes[size]].join(
    " "
  );

  return (
    <Pressable className={containerClass} {...pressableProps}>
      <Text className={textClass}>{title}</Text>
    </Pressable>
  );
}
