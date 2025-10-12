import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type ButtonVariant = "default" | "primary" | "destructive" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & PressableProps;

export function Button({
  title,
  variant = "default",
  size = "md",
  ...pressableProps
}: ButtonProps) {
  const variantStyles = buttonVariants[variant];
  const sizeStyles = buttonSizes[size];

  const tintColor = useThemeColor({}, "tint");
  const primaryColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const getColors = () => {
    switch (variant) {
      case "primary":
        return { bg: primaryColor, text: "#FFFFFF" };
      case "destructive":
        return { bg: "#E53E3E", text: "#FFFFFF" };
      case "outline":
        return { bg: "transparent", text: tintColor, border: tintColor };
      case "default":
      default:
        return { bg: tintColor, text: "#FFFFFF" };
    }
  };

  const { bg, text, border } = getColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles.container,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border ? 1 : 0,
        },
        pressed && styles.pressed,
        pressableProps.disabled && styles.disabled,
      ]}
      {...pressableProps}
    >
      <Text style={[styles.textBase, sizeStyles.text, { color: text }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const buttonSizes: Record<
  ButtonSize,
  { container: ViewStyle; text: TextStyle }
> = {
  sm: {
    container: { paddingVertical: 8, paddingHorizontal: 16 },
    text: { fontSize: 14 },
  },
  md: {
    container: { paddingVertical: 12, paddingHorizontal: 24 },
    text: { fontSize: 16 },
  },
  lg: {
    container: { paddingVertical: 16, paddingHorizontal: 32 },
    text: { fontSize: 18 },
  },
};

const buttonVariants: Record<ButtonVariant, ViewStyle> = {
  default: {},
  primary: {},
  destructive: {},
  outline: {},
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexDirection: "row",
  },
  textBase: {
    fontFamily: "Poppins_600SemiBold",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
