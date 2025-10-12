import { useThemeColor } from "@/hooks/use-theme-color";
import Checkbox from "expo-checkbox";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../themed-text";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
};

export function ControlledCheckbox({ control, name, label }: Props) {
  const checkColor = useThemeColor({}, "tint");
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
              style={[styles.label, { color: checkColor }]}
            >
              {label}
            </ThemedText>
            <Checkbox
              value={!!value}
              onValueChange={onChange}
              color={value ? checkColor : undefined}
            />
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
  },
  checkboxWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  errorText: {
    color: "#E53E3E",
    marginTop: 4,
  },
});
