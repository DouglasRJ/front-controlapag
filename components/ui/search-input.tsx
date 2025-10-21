import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type SearchInputProps = TextInputProps & {
  onSearch?: (query: string) => void;
  value: string;
};

export function SearchInput({
  style,
  onSearch,
  value,
  onChangeText,
  ...rest
}: SearchInputProps) {
  const iconColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "icon");

  const handleSearchSubmit = () => {
    if (onSearch && value) {
      onSearch(value.trim());
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: borderColor }]}>
      <Ionicons name="search" size={16} color={iconColor} style={styles.icon} />
      <TextInput
        style={[
          styles.input,
          { color: iconColor },
          style,
          Platform.OS === "web" && { outline: "none" },
        ]}
        placeholderTextColor={iconColor}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontFamily: FontPoppins.REGULAR,
    height: 30,
    // @ts-ignore
    outline: "none",
  },
});
