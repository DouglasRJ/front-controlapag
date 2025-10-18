import { useThemeColor } from "@/hooks/use-theme-color";
import Checkbox from "expo-checkbox";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
};

export function ControlledCheckbox({
  control,
  name,
  label,
  disabled = false,
}: Props) {
  const borderColor = useThemeColor({}, "tint");
  const errorColor = "#E53E3E";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <View
            style={[
              styles.checkboxWrapper,
              {
                borderColor: error ? errorColor : borderColor,
              },
            ]}
          >
            <ThemedText
              type="labelInput"
              style={[styles.label, { color: borderColor }]}
            >
              {label}
            </ThemedText>
            <Checkbox
              value={!!value}
              onValueChange={onChange}
              color={value ? borderColor : undefined}
              disabled={disabled}
            />
          </View>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
  checkboxWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  label: {},
  errorText: {
    color: "#E53E3E",
    marginTop: 4,
  },
});
