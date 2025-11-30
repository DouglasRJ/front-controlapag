import React, { useState } from "react";
import { View, Pressable, Text, Modal, type ViewProps, type PressableProps, type TextProps } from "react-native";
import { cn } from "@/utils/cn";

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end" | "center";
  className?: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  const alignClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <View className={cn("relative", className)}>
      <Pressable onPress={() => setOpen(true)}>{trigger}</Pressable>
      {open && (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            className="flex-1"
            onPress={() => setOpen(false)}
          >
            <View
              className={cn(
                "absolute top-12 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-card p-1 text-card-foreground shadow-md",
                alignClasses[align]
              )}
            >
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<any>, {
                    onSelect: () => setOpen(false),
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

export interface DropdownMenuItemProps extends PressableProps {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

export function DropdownMenuItem({
  children,
  onSelect,
  className,
  ...props
}: DropdownMenuItemProps) {
  return (
    <Pressable
      onPress={() => {
        onSelect?.();
        props.onPress?.(undefined as any);
      }}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-sm">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

