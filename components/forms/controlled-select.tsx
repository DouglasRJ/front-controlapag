import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import { View } from "react-native";
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
  disabled?: boolean;
};

export function ControlledSelect({
  control,
  name,
  label,
  options,
  placeholder,
  isMultiple = false,
  disabled = false,
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

  const currentValue = field.value || (isMultiple ? [] : null);

  return (
    <View className="mb-6" style={{ zIndex: open ? 100 : 1 }}>
      <ThemedText type="labelInput" style={{ color: textColor }}>
        {label}
      </ThemedText>
      <DropDownPicker
        multiple={isMultiple}
        open={open}
        value={currentValue}
        items={items}
        setOpen={setOpen}
        setValue={(valOrFn) => {
          if (typeof valOrFn === "function") {
            field.onChange(valOrFn(currentValue));
          } else {
            field.onChange(valOrFn);
          }
        }}
        setItems={setItems}
        onClose={() => {
          field.onBlur();
        }}
        placeholder={placeholder}
        mode="BADGE"
        renderBadgeItem={(item) => (
          <ThemedText className="text-dark">{item.label}</ThemedText>
        )}
        style={{
          borderRightWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: 4,
          borderRadius: 8,
          height: 49,
          backgroundColor: bgColor,
          borderLeftColor: textColor,
        }}
        textStyle={{
          fontSize: 16,
          fontFamily: FontPoppins.REGULAR,
          color: textColor,
        }}
        dropDownContainerStyle={{
          borderWidth: 1,
          backgroundColor: cardColor,
          borderColor: borderColor,
        }}
        placeholderStyle={{ color: borderColor }}
        zIndex={3000}
        zIndexInverse={1000}
        disabled={disabled}
      />
    </View>
  );
}
