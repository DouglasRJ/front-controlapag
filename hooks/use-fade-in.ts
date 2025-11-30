import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

export interface UseFadeInOptions {
  delay?: number;
  duration?: number;
  initialOpacity?: number;
  initialTranslateY?: number;
}

export function useFadeIn({
  delay = 0,
  duration = 300,
  initialOpacity = 0,
  initialTranslateY = 10,
}: UseFadeInOptions = {}) {
  const opacity = useSharedValue(initialOpacity);
  const translateY = useSharedValue(initialTranslateY);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    translateY.value = withDelay(delay, withTiming(0, { duration }));
  }, [delay, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

