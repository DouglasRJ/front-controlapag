import { useThemeColor } from "@/hooks/use-theme-color"; // 1. Importar o hook
import React from "react";
import { Control, Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

type ControlledInputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  type?: "text" | "password" | "email" | "number" | "textarea";
} & TextInputProps;

export function ControlledInput({
  control,
  name,
  label,
  type = "text",
  ...textInputProps
}: ControlledInputProps) {
  const textColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "tint");
  const errorColor = "#E53E3E";
  const backgroundColor = useThemeColor({}, "text");

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          {label && (
            <ThemedText
              type="labelInput"
              style={[styles.label, { color: textColor }]}
            >
              {label}
            </ThemedText>
          )}
          <TextInput
            style={[
              styles.input,
              {
                borderColor: error ? errorColor : borderColor,
                backgroundColor: backgroundColor,
              },
              type === "textarea" && styles.textarea,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={borderColor}
            secureTextEntry={type === "password"}
            keyboardType={
              type === "number"
                ? "numeric"
                : type === "email"
                ? "email-address"
                : "default"
            }
            multiline={type === "textarea"}
            numberOfLines={type === "textarea" ? 4 : 1}
            {...textInputProps}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderLeftWidth: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#E53E3E",
    marginTop: 4,
    fontFamily: "Poppins_400Regular",
  },
});
