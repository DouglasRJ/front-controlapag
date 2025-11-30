import React from "react";
import { Pressable, View, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export interface RadioProps extends Omit<PressableProps, "children"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value?: string;
  className?: string;
  disabled?: boolean;
}

export function Radio({
  checked = false,
  onCheckedChange,
  value,
  className,
  disabled,
  ...props
}: RadioProps) {
  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {checked && (
        <View className="flex-1 items-center justify-center">
          <View className="h-2.5 w-2.5 rounded-full bg-primary" />
        </View>
      )}
    </Pressable>
  );
}

