import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color"; // 1. Importar o hook
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { ThemedText } from "../themed-text";

type MaskType = "phone" | "cpf" | "cnpj" | undefined;

type ControlledInputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  type?: "text" | "password" | "email" | "number" | "textarea";
  maskType?: MaskType;
} & TextInputProps;

export function ControlledInput({
  control,
  name,
  label,
  type = "text",
  secureTextEntry,
  maskType,
  ...textInputProps
}: ControlledInputProps) {
  const isSecurityField = !!secureTextEntry;
  const isMaskedInput = !!maskType;

  const [isPasswordVisible, setPasswordVisible] = useState(isSecurityField);
  const textColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "tint");
  const errorColor = "#E53E3E";
  const backgroundColor = useThemeColor({}, "text");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const mask = (() => {
    switch (maskType) {
      case "phone":
        return Masks.BRL_PHONE;
      case "cpf":
        return Masks.CPF;
      case "cnpj":
        return Masks.CNPJ;
      default:
        return undefined;
    }
  })();

  const InputComponent = mask ? MaskInput : TextInput;

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
          <View className="relative">
            <InputComponent
              style={[
                styles.input,
                {
                  borderColor: error ? errorColor : borderColor,
                  backgroundColor: backgroundColor,
                },
                type === "textarea" && styles.textarea,
                Platform.OS === "web" && { outline: "none" },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={isSecurityField ? isPasswordVisible : false}
              keyboardType={
                type === "number"
                  ? "numeric"
                  : type === "email"
                    ? "email-address"
                    : "default"
              }
              multiline={type === "textarea"}
              numberOfLines={type === "textarea" ? 4 : 1}
              {...(isMaskedInput && { mask })}
              {...textInputProps}
            />
            {secureTextEntry && (
              <Pressable
                className="absolute right-4 top-3.5"
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color={borderColor}
                />
              </Pressable>
            )}
          </View>

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
    position: "relative",
  },
  label: {},
  input: {
    borderLeftWidth: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#242120",
    fontFamily: FontPoppins.REGULAR,
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#E53E3E",
    fontFamily: FontPoppins.REGULAR,
    fontSize: 12,
    position: "absolute",
    bottom: -22,
    left: 10,
  },
});
