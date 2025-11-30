import React, { useEffect } from "react";
import { View, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { cn } from "@/utils/cn";

const AnimatedView = Animated.createAnimatedComponent(View);

export interface FadeInViewProps extends ViewProps {
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export function FadeInView({
  delay = 0,
  duration = 300,
  className,
  children,
  style,
  ...props
}: FadeInViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration })
    );
  }, [delay, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
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

