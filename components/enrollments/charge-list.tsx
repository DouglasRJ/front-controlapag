import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Charge } from "@/types/charge";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ChargeItem } from "./charge-item";

function AnimatedIcon({ isOpen, color }: { isOpen: boolean; color: string }) {
  const rotation = useSharedValue(isOpen ? -180 : 0);
  useEffect(() => {
    rotation.value = withTiming(isOpen ? -180 : 0, { duration: 250 });
  }, [isOpen, rotation]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <Feather name="chevron-down" size={20} color={color} />
    </Animated.View>
  );
}

type ChargeListProps = {
  charges: Charge[] | undefined | null;
  initialOpen?: boolean;
  onChargePress: (charge: Charge) => void;
};

export function ChargeList({
  charges,
  initialOpen = false,
  onChargePress,
}: ChargeListProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? "light"].icon;

  const animatedHeight = useSharedValue(0);

  const contentHeight = useSharedValue(0);

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animatedHeight.value, { duration: 250 }),
      overflow: "hidden",
    };
  });

  const measureContentHeight = useCallback(
    (event: LayoutChangeEvent) => {
      const measuredHeight = event.nativeEvent.layout.height;
      console.log("Measured Content Height:", measuredHeight);

      if (measuredHeight > 0 && contentHeight.value !== measuredHeight) {
        runOnUI(() => {
          "worklet";
          contentHeight.value = measuredHeight;

          if (isOpen) {
            animatedHeight.value = measuredHeight;
          }
        })();
      }
    },
    [isOpen, contentHeight, animatedHeight]
  );

  const toggleAccordion = () => {
    const nextIsOpen = !isOpen;
    if (nextIsOpen) {
      runOnUI(() => {
        "worklet";
        animatedHeight.value =
          contentHeight.value > 0 ? contentHeight.value : 0;
      })();
    } else {
      runOnUI(() => {
        "worklet";
        animatedHeight.value = 0;
      })();
    }
    setIsOpen(nextIsOpen);
  };

  useEffect(() => {
    if (isOpen && contentHeight.value > 0) {
      runOnUI(() => {
        "worklet";

        animatedHeight.value = contentHeight.value;
      })();
    } else if (!isOpen) {
      runOnUI(() => {
        "worklet";
        animatedHeight.value = 0;
      })();
    }
  }, [isOpen, contentHeight, animatedHeight, charges]);

  const sortedCharges = charges
    ? [...charges].sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      )
    : [];

  const renderItem = ({ item }: ListRenderItemInfo<Charge>) => (
    <ChargeItem charge={item} onPress={() => onChargePress(item)} />
  );

  return (
    <View className="w-full bg-card rounded-xl p-4 shadow-sm mt-5">
      <TouchableOpacity
        onPress={toggleAccordion}
        className="flex-row justify-between items-center"
        activeOpacity={0.7}
      >
        <ThemedText className="text-base font-semibold text-card-foreground">
          Histórico de Cobranças ({sortedCharges.length})
        </ThemedText>
        <AnimatedIcon isOpen={isOpen} color={iconColor} />
      </TouchableOpacity>

      <Animated.View style={animatedContentStyle}>
        <View className=" opacity-100" onLayout={measureContentHeight}>
          {sortedCharges.length > 0 ? (
            <FlatList
              data={sortedCharges}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center py-2">
              <ThemedText className="text-muted-foreground">
                Nenhuma cobrança encontrada.
              </ThemedText>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
