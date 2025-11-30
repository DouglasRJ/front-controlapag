import React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "@/utils/cn";

export interface TableProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <View className={cn("w-full border-collapse", className)} {...props}>
      {children}
    </View>
  );
}

export interface TableHeaderProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({
  children,
  className,
  ...props
}: TableHeaderProps) {
  return (
    <View className={cn("border-b", className)} {...props}>
      {children}
    </View>
  );
}

export interface TableBodyProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <View className={cn("divide-y", className)} {...props}>
      {children}
    </View>
  );
}

export interface TableRowProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <View
      className={cn(
        "border-b transition-colors hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export interface TableHeadProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <Text
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface TableCellProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <Text
      className={cn("p-4 align-middle", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

