import { Ionicons } from "@expo/vector-icons";
import React from "react";

type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
};

export function TabBarIcon({ name, color }: TabBarIconProps) {
  return (
    <Ionicons
      size={28}
      style={{ marginBottom: -3 }}
      name={name}
      color={color}
    />
  );
}
