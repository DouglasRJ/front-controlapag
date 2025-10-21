import { useThemeStore } from "@/store/themeStore";
import { RefObject } from "react";
import { Platform } from "react-native";

interface ViewTransition {
  ready: Promise<void>;
}
type StartViewTransition = (
  updateCallback: () => Promise<void> | void
) => ViewTransition;
interface DocumentWithViewTransition extends Document {
  startViewTransition?: StartViewTransition;
}

export function useThemeTransition(rootViewRef?: RefObject<any>) {
  const toggleColorScheme = useThemeStore((state) => state.toggleColorScheme);

  const switchThemeWithAnimation = (event?: any) => {
    if (
      Platform.OS === "web" &&
      (document as DocumentWithViewTransition).startViewTransition &&
      event?.nativeEvent?.pageX !== undefined &&
      event?.nativeEvent?.pageY !== undefined
    ) {
      const x = event.nativeEvent.pageX;
      const y = event.nativeEvent.pageY;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.style.setProperty("--x", x + "px");
      document.documentElement.style.setProperty("--y", y + "px");
      document.documentElement.style.setProperty("--radius", endRadius + "px");

      (document as DocumentWithViewTransition).startViewTransition!(
        async () => {
          toggleColorScheme();
        }
      );
    } else {
      toggleColorScheme();
    }
  };

  return switchThemeWithAnimation;
}
