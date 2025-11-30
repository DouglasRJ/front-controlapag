import React, { createContext, useContext, useState } from "react";
import { View, Pressable, Text, type ViewProps, type PressableProps, type TextProps } from "react-native";
import { cn } from "@/utils/cn";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps extends ViewProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const value = controlledValue ?? internalValue;
  const onValueChange = controlledOnValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View className={cn("w-full", className)} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <View
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 p-1 text-neutral-500 dark:bg-neutral-800",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export interface TabsTriggerProps extends PressableProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  className,
  ...props
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const isActive = context.value === value;

  return (
    <Pressable
      onPress={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-neutral-500 hover:text-foreground",
        className
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={isActive ? "text-foreground" : "text-neutral-500"}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface TabsContentProps extends ViewProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className,
  ...props
}: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== value) {
    return null;
  }

  return (
    <View
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

