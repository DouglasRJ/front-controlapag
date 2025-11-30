import { useEffect, useRef } from "react";
import { useRouter, useSegments } from "expo-router";
import { useSharedValue, withTiming, runOnJS } from "react-native-reanimated";

/**
 * Hook para gerenciar transições suaves entre páginas
 * Útil para adicionar animações ao navegar entre rotas
 */
export function usePageTransition() {
  const router = useRouter();
  const segments = useSegments();
  const previousSegment = useRef<string | null>(null);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const currentSegment = segments[segments.length - 1] || "";
    
    if (previousSegment.current && previousSegment.current !== currentSegment) {
      // Fade out antes de navegar
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(() => {
          // Fade in após navegação
          opacity.value = withTiming(1, { duration: 200 });
        })();
      });
    }
    
    previousSegment.current = currentSegment;
  }, [segments, opacity]);

  const navigateWithTransition = (
    href: string,
    options?: { animated?: boolean }
  ) => {
    if (options?.animated !== false) {
      opacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(() => {
          router.push(href as any);
          setTimeout(() => {
            opacity.value = withTiming(1, { duration: 200 });
          }, 100);
        })();
      });
    } else {
      router.push(href as any);
    }
  };

  return {
    opacity,
    navigateWithTransition,
  };
}

