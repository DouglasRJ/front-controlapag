import React from "react";
import { View, Text, Image, type ViewProps, type ImageProps } from "react-native";
import { cn } from "@/utils/cn";

export interface AvatarProps extends ViewProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
  ...props
}: AvatarProps) {
  return (
    <View
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          className="h-full w-full"
          accessibilityLabel={alt}
        />
      ) : (
        <View className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
          {fallback && (
            <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {fallback}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

