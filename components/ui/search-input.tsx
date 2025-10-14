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

type SearchInputProps = TextInputProps;

export function SearchInput({ style, ...rest }: SearchInputProps) {
  const iconColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "icon");

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
    outline: "none",
  },
});
