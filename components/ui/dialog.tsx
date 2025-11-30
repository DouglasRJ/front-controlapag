import React from "react";
import { View, Text, Pressable, Modal, type ViewProps, type TextProps, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange?.(false)}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={() => onOpenChange?.(false)}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export interface DialogContentProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({
  children,
  className,
  ...props
}: DialogContentProps) {
  return (
    <View
      className={cn(
        "bg-card text-card-foreground shadow-xl rounded-xl border border-border p-6 w-[90%] max-w-lg",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export interface DialogHeaderProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({
  children,
  className,
  ...props
}: DialogHeaderProps) {
  return (
    <View
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export interface DialogTitleProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  return (
    <Text
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface DialogDescriptionProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({
  children,
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <Text
      className={cn("text-sm text-foreground/60", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface DialogFooterProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({
  children,
  className,
  ...props
}: DialogFooterProps) {
  return (
    <View
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export interface DialogCloseProps extends PressableProps {
  children?: React.ReactNode;
  className?: string;
}

export function DialogClose({
  children,
  className,
  ...props
}: DialogCloseProps) {
  return (
    <Pressable
      className={cn("absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100", className)}
      {...props}
    >
      {children || <Text className="text-foreground">✕</Text>}
    </Pressable>
  );
}

