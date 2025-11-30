import React from "react";
import { View, Pressable, Text, type ViewProps, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export interface PaginationProps extends ViewProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View
      className={cn("flex flex-row items-center justify-center gap-2", className)}
      {...props}
    >
      <Pressable
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "h-10 w-10 items-center justify-center rounded-md border border-input bg-background",
          "disabled:opacity-50",
          currentPage > 1 && "hover:bg-accent"
        )}
      >
        <Text>‹</Text>
      </Pressable>

      {pages.map((page) => (
        <Pressable
          key={page}
          onPress={() => onPageChange(page)}
          className={cn(
            "h-10 w-10 items-center justify-center rounded-md border",
            page === currentPage
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background hover:bg-accent"
          )}
        >
          <Text
            className={cn(
              page === currentPage
                ? "font-semibold text-primary-foreground"
                : "text-foreground"
            )}
          >
            {page}
          </Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "h-10 w-10 items-center justify-center rounded-md border border-input bg-background",
          "disabled:opacity-50",
          currentPage < totalPages && "hover:bg-accent"
        )}
      >
        <Text>›</Text>
      </Pressable>
    </View>
  );
}

