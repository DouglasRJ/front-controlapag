import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";

type PickerOption = {
  label: string;
  value: string | number | undefined;
};

type ControlledPickerProps = {
  control: Control<any>;
  name: string;
  label: string;
  options: PickerOption[];
  placeholder?: string;
};

export function ControlledPicker({
  control,
  name,
  label,
  options,
  placeholder = "Selecione...",
}: ControlledPickerProps) {
  const textColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "tint");
  const errorColor = "#E53E3E";
  const backgroundColor = useThemeColor({}, "text");

  const fullOptions: PickerOption[] = [
    { label: placeholder, value: undefined },
    ...options,
  ];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <ThemedText
            type="labelInput"
            style={[styles.label, { color: textColor }]}
          >
            {label}
          </ThemedText>
          <View
            style={[
              styles.pickerContainer,
              {
                borderColor: error ? errorColor : borderColor,
                backgroundColor: backgroundColor,
              },
              ,
              error && styles.inputError,
            ]}
          >
            <Picker
              style={styles.picker}
              selectedValue={typeof value === "string" ? value : undefined}
              onValueChange={(itemValue) => {
                onChange(itemValue === undefined ? undefined : itemValue);
              }}
            >
              {fullOptions.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
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
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  pickerContainer: {
    borderLeftWidth: 4,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 49,
  },
  inputError: {
    borderColor: "#E53E3E",
  },
  errorText: {
    color: "#E53E3E",
    marginTop: 4,
  },
  picker: {
    height: 49,
    borderRadius: 8,
    borderWidth: 0,
  },
});
