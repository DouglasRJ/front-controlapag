import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Toast, ToastType, useToastStore } from "@/store/toastStore";

const toastStyles = (type: ToastType) => {
  switch (type) {
    case "success":
      return { icon: "checkmark-circle", className: "bg-green-600" };
    case "error":
      return { icon: "close-circle", className: "bg-red-600" };
    case "warning":
      return { icon: "warning", className: "bg-yellow-600" };
    case "info":
    default:
      return { icon: "information-circle", className: "bg-blue-600" };
  }
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToastStore();
  const { icon, className } = toastStyles(toast.type);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className={`p-3 rounded-lg flex-row items-center my-1 shadow-md max-w-sm w-full ${className}`}
    >
      <Ionicons name={icon} size={20} color="white" className="mr-3" />
      <Text className="text-white flex-1 font-semibold text-sm mr-4">
        {toast.message}
      </Text>
      <Pressable onPress={() => removeToast(toast.id)}>
        <Ionicons name="close" size={18} color="white" />
      </Pressable>
    </Animated.View>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();
  const insets = useSafeAreaInsets();
  const topOffset = insets.top || 10;

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      style={{ paddingTop: topOffset }}
      className="absolute top-0 left-0 right-0 z-[100] items-center pointer-events-box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};
