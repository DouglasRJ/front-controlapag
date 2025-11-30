import React from "react";
import { View, Pressable, Modal, type ViewProps, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Sheet({
  open = false,
  onOpenChange,
  children,
  side = "right",
}: SheetProps) {
  const sideClasses = {
    top: "top-0 left-0 right-0 rounded-b-lg",
    bottom: "bottom-0 left-0 right-0 rounded-t-lg",
    left: "top-0 bottom-0 left-0 rounded-r-lg",
    right: "top-0 bottom-0 right-0 rounded-l-lg",
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={() => onOpenChange?.(false)}
    >
      <Pressable
        className="flex-1 bg-black/50"
        onPress={() => onOpenChange?.(false)}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className={cn(
            "absolute bg-card border border-border shadow-lg",
            sideClasses[side],
            side === "left" || side === "right" ? "w-[90%] max-w-sm" : "h-[90%]"
          )}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export interface SheetContentProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetContent({
  children,
  className,
  ...props
}: SheetContentProps) {
  return (
    <View className={cn("p-6", className)} {...props}>
      {children}
    </View>
  );
}

export interface SheetHeaderProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetHeader({
  children,
  className,
  ...props
}: SheetHeaderProps) {
  return (
    <View
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export interface SheetTitleProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetTitle({ children, className, ...props }: SheetTitleProps) {
  return (
    <View
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export interface SheetDescriptionProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function SheetDescription({
  children,
  className,
  ...props
}: SheetDescriptionProps) {
  return (
    <View
      className={cn("text-sm text-foreground/60", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export interface SheetCloseProps extends PressableProps {
  children?: React.ReactNode;
  className?: string;
}

export function SheetClose({
  children,
  className,
  ...props
}: SheetCloseProps) {
  return (
    <Pressable
      className={cn("absolute right-4 top-4 rounded-sm opacity-70", className)}
      {...props}
    >
      {children || <View className="h-4 w-4" />}
    </Pressable>
  );
}

