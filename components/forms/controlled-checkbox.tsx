import { useThemeColor } from "@/hooks/use-theme-color";
import { Checkbox } from "expo-checkbox";
import { Control, Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { ThemedText } from "../themed-text";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
  labelReverse?: boolean;
  colorText?: string;
};

const ERROR_COLOR = "#EF4444";

export function ControlledCheckbox({
  control,
  name,
  label,
  disabled = false,
  labelReverse = false,
  colorText,
}: Props) {
  const borderColor = useThemeColor({}, "tint");

  const rowDirectionClass = labelReverse ? "flex-row-reverse" : "flex-row";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="w-full">
          <View
            className={`w-full ${rowDirectionClass} items-center justify-between gap-2`}
          >
            <ThemedText
              className={colorText || "text-primary"}
              type="labelInput"
            >
              {label}
            </ThemedText>

            <Checkbox
              value={!!value}
              onValueChange={onChange}
              disabled={disabled}
              color={error ? ERROR_COLOR : value ? borderColor : undefined}
            />
          </View>

          {error && <Text className="text-red-500 mt-1">{error.message}</Text>}
        </View>
      )}
    />
  );
}
