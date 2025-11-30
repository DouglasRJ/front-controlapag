import React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends ViewProps {
  className?: string;
  variant?: "default" | "circular" | "rectangular";
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Skeleton({
  className,
  variant = "default",
  style,
  ...props
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const borderRadius = variant === "circular" ? "full" : variant === "rectangular" ? "none" : "lg";

  return (
    <AnimatedView
      className={cn(
        "rounded-lg bg-neutral-200 dark:bg-neutral-800",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-none",
        className
      )}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends ViewProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
}

export function SkeletonText({
  lines = 1,
  className,
  lineClassName,
  ...props
}: SkeletonTextProps) {
  return (
    <View className={cn("gap-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-4",
            index === lines - 1 && "w-3/4", // Last line is shorter
            lineClassName
          )}
        />
      ))}
    </View>
  );
}

export interface SkeletonCardProps extends ViewProps {
  showHeader?: boolean;
  showFooter?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({
  showHeader = true,
  showFooter = false,
  lines = 3,
  className,
  ...props
}: SkeletonCardProps) {
  return (
    <View
      className={cn(
        "rounded-xl bg-card border border-border p-4 gap-4",
        className
      )}
      {...props}
    >
      {showHeader && (
        <View className="flex-row items-center gap-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </View>
        </View>
      )}
      <SkeletonText lines={lines} />
      {showFooter && (
        <View className="flex-row gap-2 mt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </View>
      )}
    </View>
  );
}

export interface SkeletonAvatarProps extends ViewProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SkeletonAvatar({
  size = "md",
  className,
  ...props
}: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}

export interface SkeletonTableProps extends ViewProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
  ...props
}: SkeletonTableProps) {
  return (
    <View className={cn("rounded-xl bg-card border border-border overflow-hidden", className)} {...props}>
      {showHeader && (
        <View className="flex-row gap-2 p-4 border-b border-border bg-neutral-50 dark:bg-neutral-900">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={`header-${index}`}
              className={cn("h-4 flex-1", index === columns - 1 && "w-1/4")}
            />
          ))}
        </View>
      )}
      <View className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <View key={`row-${rowIndex}`} className="flex-row gap-2 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className={cn("h-4 flex-1", colIndex === columns - 1 && "w-1/4")}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export interface SkeletonListProps extends ViewProps {
  items?: number;
  showAvatar?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export function SkeletonList({
  items = 5,
  showAvatar = true,
  showSubtitle = true,
  className,
  ...props
}: SkeletonListProps) {
  return (
    <View className={cn("gap-2", className)} {...props}>
      {Array.from({ length: items }).map((_, index) => (
        <View
          key={index}
          className="flex-row items-center gap-3 p-3 rounded-lg bg-card border border-border"
        >
          {showAvatar && <SkeletonAvatar size="md" />}
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            {showSubtitle && <Skeleton className="h-3 w-1/2" />}
          </View>
        </View>
      ))}
    </View>
  );
}

export interface SkeletonFormProps extends ViewProps {
  fields?: number;
  showSubmit?: boolean;
  className?: string;
}

export function SkeletonForm({
  fields = 4,
  showSubmit = true,
  className,
  ...props
}: SkeletonFormProps) {
  return (
    <View className={cn("gap-4", className)} {...props}>
      {Array.from({ length: fields }).map((_, index) => (
        <View key={index} className="gap-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full rounded-md" />
        </View>
      ))}
      {showSubmit && (
        <View className="flex-row gap-2 mt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </View>
      )}
    </View>
  );
}

