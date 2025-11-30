import React from "react";
import { View, type ViewProps } from "react-native";
import { FadeInView } from "./fade-in-view";
import { cn } from "@/utils/cn";

export interface StaggerViewProps extends ViewProps {
  delay?: number;
  staggerDelay?: number;
  className?: string;
  children: React.ReactNode[];
}

export function StaggerView({
  delay = 0,
  staggerDelay = 50,
  className,
  children,
  ...props
}: StaggerViewProps) {
  return (
    <View className={cn("gap-2", className)} {...props}>
      {React.Children.map(children, (child, index) => (
        <FadeInView key={index} delay={delay + index * staggerDelay}>
          {child}
        </FadeInView>
      ))}
    </View>
  );
}

