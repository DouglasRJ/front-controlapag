import { FontPoppins } from "@/constants/font";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewProps,
} from "react-native";
import { ThemedText } from "../themed-text";

type ControlledDatePickerProps = {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
} & ViewProps;

const styles = StyleSheet.create({
  fontRegular: {
    fontFamily: FontPoppins.REGULAR,
  },
  errorFont: {
    fontFamily: FontPoppins.REGULAR,
  },
  // Estilo para o <input type="date"> na web
  webDatePicker: {
    borderWidth: 0,
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    color: "#000000", // Cor do texto (ajuste para o seu tema 'text-foreground')
    fontFamily: FontPoppins.REGULAR,
    fontSize: 16,
    outline: "none",
  },
});

// Função para formatar a data para o formato YYYY-MM-DD (necessário para <input type="date">)
const formatDateForInput = (date: Date): string => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export function ControlledDatePicker({
  control,
  name,
  label,
  disabled = false,
  ...viewProps
}: ControlledDatePickerProps) {
  // 'showPicker' só é usado para iOS e Android
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        // Handler para NATIVO (iOS/Android)
        const onDateChangeNative = (
          event: DateTimePickerEvent,
          selectedDate?: Date
        ) => {
          if (Platform.OS === "android") {
            setShowPicker(false);
          }
          if (event.type === "set" && selectedDate) {
            onChange(selectedDate);
          }
          onBlur();
        };

        // Handler para WEB
        const onDateChangeWeb = (event: any) => {
          const dateString = event.target.value;
          if (dateString) {
            // Converte "YYYY-MM-DD" string de volta para um objeto Date
            const date = new Date(dateString + "T00:00:00");
            onChange(date);
          } else {
            onChange(null);
          }
          onBlur();
        };

        const togglePicker = () => {
          if (disabled) return;
          setShowPicker(!showPicker);
        };

        const currentDate = value ? new Date(value) : new Date();

        //
        // --- RENDERIZAÇÃO WEB ---
        //
        if (Platform.OS === "web") {
          return (
            <View className="w-full mb-4 relative" {...viewProps}>
              {label && (
                <ThemedText type="labelInput" className="text-primary">
                  {label}
                </ThemedText>
              )}
              <View
                className={`
                  border-l-4 rounded-lg px-3 flex-row items-center
                  bg-card min-h-[50px]
                  ${error ? "border-destructive" : "border-primary"} 
                  ${disabled ? "opacity-50" : ""}
                `}
                style={[Platform.OS === "web" && { outline: "none" }]}
              >
                {/* Usamos um TextInput e passamos a prop 'type="date"'.
                  Isso é traduzido pelo React Native Web para <input type="date">
                */}
                <TextInput
                  // @ts-ignore
                  type="date"
                  style={[
                    styles.webDatePicker,
                    {
                      color: value ? "#000000" : "#9CA3AF",
                    }, // Cor do texto (foreground) vs (muted-foreground)
                  ]}
                  value={value ? formatDateForInput(currentDate) : ""}
                  onChange={onDateChangeWeb}
                  onBlur={onBlur}
                  disabled={disabled}
                />
              </View>

              {error && (
                <Text
                  className="text-xs absolute -bottom-5 left-2.5 text-destructive"
                  style={styles.errorFont}
                >
                  {error.message}
                </Text>
              )}
            </View>
          );
        }

        //
        // --- RENDERIZAÇÃO NATIVA (iOS / Android) ---
        //
        return (
          <View className="w-full mb-4 relative" {...viewProps}>
            {label && (
              <ThemedText type="labelInput" className="text-primary">
                {label}
              </ThemedText>
            )}
            <View className="relative">
              <Pressable
                onPress={togglePicker}
                disabled={disabled}
                className={`
                  border-l-4 rounded-lg px-3 py-3 flex-row justify-between items-center min-h-[50px]
                  bg-card 
                  ${error ? "border-destructive" : "border-primary"} 
                  ${disabled ? "opacity-50" : ""}
                `}
              >
                <Text
                  className={`
                    text-base 
                    ${value ? "text-foreground" : "text-muted-foreground"}
                  `}
                  style={styles.fontRegular}
                >
                  {value
                    ? new Date(value).toLocaleDateString("pt-BR")
                    : "Selecionar data"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  className={error ? "text-destructive" : "text-primary"}
                />
              </Pressable>
            </View>

            {showPicker && (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChangeNative}
                onTouchCancel={() => setShowPicker(false)}
              />
            )}

            {showPicker && Platform.OS === "ios" && (
              <View className="w-full flex-row justify-end">
                <Pressable onPress={() => setShowPicker(false)} className="p-2">
                  <ThemedText className="text-primary font-semibold">
                    Confirmar
                  </ThemedText>
                </Pressable>
              </View>
            )}

            {error && (
              <Text
                className="text-xs absolute -bottom-5 left-2.5 text-destructive"
                style={styles.errorFont}
              >
                {error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}
