import { Ionicons } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import React, { ComponentProps, useEffect } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";
import { isProviderRole } from "@/utils/user-role";
import { Logo } from "./logo";
import { ThemedText } from "./themed-text";

type AnimatedSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type Option = {
  label: string;
  icon: IoniconName;
  href: LinkProps["href"];
};

const SIDEBAR_WIDTH_PERCENT = 0.8;

export function AnimatedSidebar({ isOpen, onClose }: AnimatedSidebarProps) {
  const { user, logout } = useAuthStore();

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sidebarWidth = width * SIDEBAR_WIDTH_PERCENT;

  const progress = useSharedValue(0);

  const animatedSidebarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-sidebarWidth, 0]) },
    ],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    pointerEvents: progress.value > 0 ? "auto" : "none",
  }));

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, { duration: 300 });
  }, [isOpen, progress]);

  const options: Option[] = [
    {
      label: "Início",
      icon: "home-outline",
      href: isProviderRole(user?.role) ? "/services" : "/enrollments",
    },
    {
      label: "Perfil",
      icon: "person-outline",
      href: "/profile",
    },
  ];

  const handleLogout = () => {
    onClose();

    logout();
  };

  return (
    <>
      <Animated.View
        style={animatedOverlayStyle}
        className="absolute inset-0 bg-black/60 z-40"
      >
        <Pressable onPress={onClose} className="flex-1" />
      </Animated.View>

      <Animated.View
        style={[
          {
            width: sidebarWidth,
            paddingTop: insets.top,
          },
          animatedSidebarStyle,
        ]}
        className="absolute top-0 bottom-0 h-screen left-0 bg-background z-50 border-r border-slate-200"
      >
        <View>
          <View className="flex-row items-center justify-between p-4 border-b border-slate-200">
            <View className="">
              <Logo fontSize={24} hasMargin={false} />
            </View>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={28} className="text-foreground " />
            </Pressable>
          </View>

          <View className="flex- p-4">
            {options.map((option) => (
              <Link key={option.label} href={option.href} asChild>
                <Pressable
                  onPress={onClose}
                  className="flex-row items-center p-3 mb-2 rounded-lg active:bg-muted"
                >
                  <Ionicons
                    name={option.icon}
                    size={22}
                    className="mr-4 text-foreground"
                  />
                  <ThemedText>{option.label}</ThemedText>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View className="mt-auto justify-self-end p-4 border-t border-slate-200">
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center p-3 rounded-lg active:bg-muted"
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              className="mr-4 text-foreground"
            />
            <ThemedText className="text-foreground">Sair</ThemedText>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}
