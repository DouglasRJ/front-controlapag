import React from "react";
import { View, Modal, Pressable, type ViewProps } from "react-native";
import { LoadingSpinner } from "./loading-spinner";
import { ThemedText } from "../themed-text";
import { cn } from "@/utils/cn";
import { ScaleInView } from "./scale-in-view";

export interface LoadingOverlayProps extends ViewProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  variant?: "default" | "minimal" | "fullscreen";
}

export function LoadingOverlay({
  visible,
  message,
  transparent = true,
  dismissible = false,
  onDismiss,
  className,
  variant = "default",
  ...props
}: LoadingOverlayProps) {
  if (variant === "minimal") {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
      >
        <Pressable
          className={cn(
            "flex-1 items-center justify-center",
            transparent && "bg-black/30",
            className
          )}
          onPress={dismissible ? onDismiss : undefined}
          {...props}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <ScaleInView>
              <View className="bg-card rounded-lg p-4 shadow-lg border border-border">
                <LoadingSpinner size="md" message={message} />
              </View>
            </ScaleInView>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  if (variant === "fullscreen") {
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="fade"
        statusBarTranslucent
      >
        <View
          className={cn(
            "flex-1 items-center justify-center bg-background",
            className
          )}
          {...props}
        >
          <ScaleInView>
            <View className="items-center gap-4">
              <LoadingSpinner size="lg" />
              {message && (
                <ThemedText className="text-foreground/80 text-center max-w-sm">
                  {message}
                </ThemedText>
              )}
            </View>
          </ScaleInView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable
        className={cn(
          "flex-1 items-center justify-center",
          transparent ? "bg-black/50" : "bg-background",
          className
        )}
        onPress={dismissible ? onDismiss : undefined}
        {...props}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <ScaleInView>
            <View className="bg-card rounded-xl p-6 shadow-lg border border-border min-w-64">
              <LoadingSpinner size="lg" message={message} />
            </View>
          </ScaleInView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

