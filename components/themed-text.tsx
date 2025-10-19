import { Text, type TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "labelInput";
  className?: string;
};

const typeStyles = {
  default: "text-base leading-6 font-regular",
  title: "text-4xl leading-8  font-bold",
  defaultSemiBold: "text-base leading-6  font-semibold",
  subtitle: "text-xl  font-bold",
  link: "leading-8 text-base text-blue-600 dark:text-blue-400 font-regular",
  labelInput: "text-sm  font-medium",
};

export function ThemedText({
  style,
  type = "default",
  className = "",
  ...rest
}: ThemedTextProps) {
  const baseClasses = "text-foreground dark:text-dark-foreground";

  const combinedClassName = twMerge(
    baseClasses,
    typeStyles[type] ?? typeStyles.default,
    className
  );

  return <Text className={combinedClassName} style={style} {...rest} />;
}
