import { FontPoppins } from "@/constants/font";
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

type ButtonVariant = "default" | "primary" | "destructive" | "outline" | "link";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
} & PressableProps;

export function Button({
  title,
  variant = "default",
  size = "md",
  style,
  ...pressableProps
}: ButtonProps) {
  // Cores baseadas no tema
  const tintColor = useThemeColor({}, "tint");
  const textColorPrimary = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const sizeStyles = buttonSizes[size];

  const getVariantStyles = (): {
    container: ViewStyle;
    text: TextStyle;
  } => {
    switch (variant) {
      case "primary":
        return {
          container: { backgroundColor: textColorPrimary },
          text: { color: backgroundColor },
        };
      case "destructive":
        return {
          container: { backgroundColor: "#E53E3E" },
          text: { color: "#FFFFFF" },
        };
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderColor: tintColor,
            borderWidth: 1,
          },
          text: { color: tintColor },
        };
      case "link":
        return {
          container: { backgroundColor: "transparent" },
          text: { color: tintColor, textDecorationLine: "underline" },
        };
      case "default":
      default:
        return {
          container: { backgroundColor: tintColor },
          text: { color: "#FFFFFF" },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles.container,
        variantStyles.container,
        pressed && styles.pressed,
        pressableProps.disabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      <Text style={[styles.textBase, sizeStyles.text, variantStyles.text]}>
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
    container: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    text: { fontSize: 14 },
  },
  md: {
    container: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
    text: { fontSize: 16 },
  },
  lg: {
    container: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10 },
    text: { fontSize: 18, textTransform: "uppercase" },
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textBase: {
    fontSize: 14,
    fontFamily: FontPoppins.REGULAR,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
