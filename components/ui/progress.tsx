import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/utils/cn";

export interface ProgressProps extends ViewProps {
  value?: number; // 0-100
  className?: string;
  indicatorClassName?: string;
}

export function Progress({
  value = 0,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <View
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800",
        className
      )}
      {...props}
    >
      <View
        className={cn(
          "h-full bg-primary-500 transition-all",
          indicatorClassName
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </View>
  );
}

