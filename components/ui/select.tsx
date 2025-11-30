import React, { useState } from "react";
import { View, Text, Pressable, Modal, type ViewProps, type TextProps, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  children,
  placeholder = "Select...",
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className={cn("relative", className)}>
      <Pressable
        onPress={() => setOpen(true)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <Text className={cn(value ? "text-foreground" : "text-neutral-500")}>
          {value || placeholder}
        </Text>
        <Text className="text-neutral-500">▼</Text>
      </Pressable>
      {open && (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            className="flex-1 items-center justify-center bg-black/50"
            onPress={() => setOpen(false)}
          >
            <View className="w-[90%] max-w-sm rounded-xl border border-border bg-card p-2">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<any>, {
                    onSelect: (val: string) => {
                      onValueChange?.(val);
                      setOpen(false);
                    },
                    selectedValue: value,
                  });
                }
                return child;
              })}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

export interface SelectItemProps extends PressableProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
  selectedValue?: string;
  className?: string;
}

export function SelectItem({
  value,
  children,
  onSelect,
  selectedValue,
  className,
  ...props
}: SelectItemProps) {
  const isSelected = selectedValue === value;

  return (
    <Pressable
      onPress={() => onSelect?.(value)}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn(isSelected && "font-medium")}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

