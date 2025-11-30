import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/utils/cn";

export interface ResponsiveContainerProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
  /**
   * Breakpoints para diferentes tamanhos de tela
   * sm: 640px, md: 768px, lg: 1024px, xl: 1280px
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * Padding responsivo
   */
  padding?: "none" | "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "p-2 md:p-4",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
};

export function ResponsiveContainer({
  className,
  children,
  maxWidth = "full",
  padding = "md",
  ...props
}: ResponsiveContainerProps) {
  return (
    <View
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Grid responsivo com colunas adaptáveis
 */
export interface ResponsiveGridProps extends ViewProps {
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

const gapClasses = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export function ResponsiveGrid({
  columns = { default: 1, sm: 2, md: 3 },
  gap = "md",
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  const gridCols = {
    default: `grid-cols-${columns.default || 1}`,
    sm: columns.sm ? `sm:grid-cols-${columns.sm}` : "",
    md: columns.md ? `md:grid-cols-${columns.md}` : "",
    lg: columns.lg ? `lg:grid-cols-${columns.lg}` : "",
  };

  return (
    <View
      className={cn(
        "flex-row flex-wrap",
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

