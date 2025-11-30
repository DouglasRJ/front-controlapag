import React, { useEffect } from "react";
import { View, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { cn } from "@/utils/cn";

const AnimatedView = Animated.createAnimatedComponent(View);

export interface SlideInViewProps extends ViewProps {
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  className?: string;
  children: React.ReactNode;
}

export function SlideInView({
  delay = 0,
  duration = 400,
  direction = "up",
  distance = 20,
  className,
  children,
  style,
  ...props
}: SlideInViewProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const initialX = direction === "left" ? -distance : direction === "right" ? distance : 0;
    const initialY = direction === "up" ? distance : direction === "down" ? -distance : 0;

    translateX.value = initialX;
    translateY.value = initialY;
    opacity.value = 0;

    translateX.value = withDelay(
      delay,
      withTiming(0, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, {
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
  }, [delay, duration, direction, distance, translateX, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
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

