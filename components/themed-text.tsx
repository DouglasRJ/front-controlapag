import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  color?:
    | "text"
    | "background"
    | "tint"
    | "icon"
    | "tabIconDefault"
    | "tabIconSelected"
    | "card"
    | "border";
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "titleNoBold"
    | "labelInput";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  color = "text",
  ...rest
}: ThemedTextProps) {
  const colorText = useThemeColor(
    { light: lightColor, dark: darkColor },
    color
  );

  return (
    <Text
      style={[
        { color: colorText },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "labelInput" ? styles.labelInput : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Poppins_600SemiBold",
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "Poppins_400Regular",
  },
  titleNoBold: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: "Poppins_700Bold",
  },
  labelInput: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
});
