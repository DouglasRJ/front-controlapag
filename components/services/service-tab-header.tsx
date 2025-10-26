import { ThemedText } from "@/components/themed-text";
import React from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export type TabKey = "details" | "enrollments" | "schedules";

export type TabConfig = {
  key: TabKey;
  title: string;
};

export type TabMeasurements = {
  x: number;
  width: number;
};

type ServiceTabHeaderProps = {
  tabs: TabConfig[];
  activeTab: TabKey;
  onTabChange: (tabKey: TabKey) => void;
  isEditing: boolean;
  indicatorTranslateX: SharedValue<number>;
  indicatorWidth: SharedValue<number>;
  onTabLayout: (tabKey: TabKey) => (event: LayoutChangeEvent) => void;
};

const tabIndicatorPadding = 1;

export function ServiceTabHeader({
  tabs,
  activeTab,
  onTabChange,
  isEditing,
  indicatorTranslateX,
  indicatorWidth,
  onTabLayout,
}: ServiceTabHeaderProps) {
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(indicatorWidth.value, { damping: 15, stiffness: 120 }),
      transform: [
        {
          translateX: withSpring(indicatorTranslateX.value, {
            damping: 15,
            stiffness: 120,
          }),
        },
      ],
    };
  });

  return (
    <View className="w-full px-5">
      <View
        className={`relative flex-row rounded-full border border-icon ${
          isEditing ? "opacity-50" : ""
        }`}
      >
        <Animated.View
          className="absolute top-0 left-0 h-full rounded-full bg-primary"
          style={[indicatorAnimatedStyle]}
        />

        {tabs.map(({ key, title }) => {
          const isActive = activeTab === key;
          return (
            <Pressable
              key={key}
              onPress={() => onTabChange(key)}
              onLayout={onTabLayout(key)}
              className="flex-1 items-center justify-center p-2.5 z-10"
              disabled={isEditing}
            >
              <ThemedText
                className={`text-[10px] md:text-sm text-center font-semibold transition-colors duration-300 ${
                  isActive ? "text-card" : "text-foreground"
                }`}
              >
                {title}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
