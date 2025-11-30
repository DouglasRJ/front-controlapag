import React from "react";
import { Pressable, View, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export interface CheckboxProps extends Omit<PressableProps, "children"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      className={cn(
        "h-4 w-4 shrink-0 rounded-md border border-primary",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {checked && (
        <View className="flex-1 items-center justify-center">
          <View className="h-2 w-2 rounded-md bg-primary-foreground" />
        </View>
      )}
    </Pressable>
  );
}

