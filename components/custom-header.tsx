import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { useThemeTransition } from "@/hooks/use-theme-transition";
import { useAuthStore } from "@/store/authStore";
import { useSidebar } from "@/store/sidebarStore";
import { useThemeStore } from "@/store/themeStore";
import { USER_ROLE } from "@/types/user-role";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, View } from "react-native";

export function CustomHeader() {
  const { user } = useAuthStore();
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const switchThemeWithAnimation = useThemeTransition();
  const { openSidebar } = useSidebar();

  const roleText = user?.role === USER_ROLE.PROVIDER ? "Prestador" : "Cliente";

  const handleProfilePress = () => console.log("Profile picture pressed");

  const handleToggleColor = (event: any) => {
    switchThemeWithAnimation(event);
  };

  return (
    <View className="flex-row justify-between items-center px-4 w-full bg-background pt-5 pb-5 border-b border-borderColor ">
      <Pressable onPress={openSidebar} className="items-center p-2">
        <Ionicons name="menu" size={32} className="text-foreground" />
      </Pressable>

      <View className="items-center relative">
        <Logo fontSize={24} hasMargin />
        <ThemedText className="text-sm absolute bottom-[1px] text-foreground">
          {roleText}
        </ThemedText>
      </View>

      <View className="flex-row items-center space-x-2">
        <Pressable onPress={handleToggleColor} className="items-center p-2">
          <Ionicons
            name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"}
            size={24}
            className="text-foreground"
          />
        </Pressable>

        <Pressable onPress={handleProfilePress} className="items-center">
          {user?.image ? (
            <Image
              source={{ uri: user?.image }}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={36}
              className="text-foreground "
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
