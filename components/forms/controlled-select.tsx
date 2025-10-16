import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ThemedText } from "../themed-text";

type Option = {
  label: string;
  value: string;
};

type ControlledSelectProps = {
  control: Control<any>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  isMultiple?: boolean;
};

export function ControlledSelect({
  control,
  name,
  label,
  options,
  placeholder,
  isMultiple = false,
}: ControlledSelectProps) {
  const { field } = useController({
    control,
    name,
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "text");

  return (
    <View style={styles.container}>
      <ThemedText
        type="labelInput"
        style={[styles.label, { color: textColor }]}
      >
        {label}
      </ThemedText>
      <DropDownPicker
        multiple={isMultiple}
        open={open}
        value={
          isMultiple
            ? Array.isArray(field.value)
              ? field.value
              : []
            : field.value
        }
        items={items}
        setOpen={setOpen}
        setValue={(callback) => field.onChange(callback(field.value))}
        setItems={setItems}
        placeholder={placeholder}
        mode="BADGE"
        renderBadgeItem={(item) => (
          <ThemedText color="background">{item.label},</ThemedText>
        )}
        style={{
          ...styles.picker,
          backgroundColor: bgColor,
          borderLeftColor: textColor,
        }}
        textStyle={{ ...styles.text, color: textColor }}
        dropDownContainerStyle={{
          ...styles.dropDown,
          backgroundColor: cardColor,
          borderColor: borderColor,
        }}
        placeholderStyle={{ color: borderColor }}
        zIndex={3000}
        zIndexInverse={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {},
  picker: {
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 49,
  },
  text: {
    fontSize: 16,
    fontFamily: FontPoppins.REGULAR,
  },
  dropDown: {
    borderWidth: 1,
  },
});
