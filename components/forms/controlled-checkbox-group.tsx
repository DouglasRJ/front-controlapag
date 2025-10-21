import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Control, useController } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ThemedText } from "../themed-text";

type Option = {
  label: string;
  value: string;
};

type ControlledCheckboxGroupProps = {
  control: Control<any>;
  name: string;
  label: string;
  options: Option[];
  disabled?: boolean;
};

export function ControlledCheckboxGroup({
  control,
  name,
  label,
  options,
  disabled,
}: ControlledCheckboxGroupProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const { field } = useController({
    control,
    name,
  });

  const value = field.value || {};

  const handleValueChange = (optionValue: string, isChecked: boolean) => {
    const newValue = {
      ...value,
      [optionValue]: isChecked,
    };
    field.onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <BouncyCheckbox
            key={option.value}
            text={option.label}
            isChecked={value[option.value] || false}
            onPress={(isChecked) => handleValueChange(option.value, isChecked)}
            style={styles.checkbox}
            fillColor={tintColor}
            textStyle={{ color: textColor, textDecorationLine: "none" }}
            iconStyle={{ borderColor: tintColor }}
            innerIconStyle={{ borderWidth: 2 }}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  checkbox: {
    paddingVertical: 4,
  },
});
