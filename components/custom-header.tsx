import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

export function CustomHeader() {
  const { user } = useAuthStore();
  const iconMenuColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  console.log("user", user);

  const roleText = user?.role === USER_ROLE.PROVIDER ? "Prestador" : "Cliente";

  const handleMenuPress = () => {
    console.log("Menu button pressed");
  };

  const handleProfilePress = () => {
    console.log("Profile picture pressed");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Pressable onPress={handleMenuPress} style={styles.iconContainer}>
        <Ionicons name="menu" size={32} color={iconMenuColor} />
      </Pressable>

      <View style={styles.titleContainer}>
        <Logo fontSize={24} />
        <ThemedText style={styles.roleText}>{roleText}</ThemedText>
      </View>

      <Pressable onPress={handleProfilePress} style={styles.iconContainer}>
        {user?.image ? (
          <Image source={{ uri: user?.image }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={36} color={"#fff"} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 85,
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 20,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
  },
  iconContainer: {
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    position: "relative",
  },
  roleText: {
    fontSize: 14,
    fontFamily: FontPoppins.MEDIUM,
    position: "absolute",
    bottom: 14,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
