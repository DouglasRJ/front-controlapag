import React, { useState } from "react";
import { View, Text, Pressable, type ViewProps, type TextProps, type PressableProps } from "react-native";
import { cn } from "@/utils/cn";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <View className="relative">
      <Pressable
        onPressIn={() => setIsVisible(true)}
        onPressOut={() => setIsVisible(false)}
      >
        {children}
      </Pressable>
      {isVisible && (
        <View
          className={cn(
            "absolute z-50 rounded-md border bg-neutral-900 px-3 py-1.5 text-xs text-white shadow-md",
            sideClasses[side],
            className
          )}
        >
          {typeof content === "string" ? (
            <Text className="text-xs text-white">{content}</Text>
          ) : (
            content
          )}
        </View>
      )}
    </View>
  );
}

