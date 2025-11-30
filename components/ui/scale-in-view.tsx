import React, { useEffect } from "react";
import { View, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { cn } from "@/utils/cn";

const AnimatedView = Animated.createAnimatedComponent(View);

export interface ScaleInViewProps extends ViewProps {
  delay?: number;
  duration?: number;
  useSpring?: boolean;
  initialScale?: number;
  className?: string;
  children: React.ReactNode;
}

export function ScaleInView({
  delay = 0,
  duration = 300,
  useSpring = false,
  initialScale = 0.8,
  className,
  children,
  style,
  ...props
}: ScaleInViewProps) {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = initialScale;
    opacity.value = 0;

    if (useSpring) {
      scale.value = withDelay(
        delay,
        withSpring(1, {
          damping: 15,
          stiffness: 150,
        })
      );
      opacity.value = withDelay(
        delay,
        withSpring(1, {
          damping: 15,
          stiffness: 150,
        })
      );
    } else {
      scale.value = withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );
    }
  }, [delay, duration, useSpring, initialScale, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedView
      className={className}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedView>
  );
}

