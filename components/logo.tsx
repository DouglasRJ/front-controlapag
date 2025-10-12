import { useThemeColor } from "@/hooks/use-theme-color";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type LogoProps = {
  fontSize?: number;
  showIcon?: boolean;
};

export const Logo = ({ fontSize = 52, showIcon = false }: LogoProps) => {
  const primaryColor = useThemeColor({}, "tint");

  const iconSize = fontSize * 0.6;
  const containerMarginBottom = fontSize * 0.9;

  return (
    <View
      style={[styles.titleContainer, { marginBottom: containerMarginBottom }]}
    >
      <ThemedText
        style={[styles.titleText, { fontSize }, { color: primaryColor }]}
      >
        Controla
      </ThemedText>
      <ThemedText
        style={[styles.titleTextBold, { fontSize }, { color: primaryColor }]}
      >
        PAG
      </ThemedText>

      {showIcon && (
        <>
          <View style={styles.iconMoney}>
            <MaterialIcons
              name="attach-money"
              size={iconSize}
              color={primaryColor}
            />
          </View>
          <View style={styles.iconPhone}>
            <MaterialCommunityIcons
              name="cellphone-message"
              size={iconSize}
              color={primaryColor}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  titleText: {
    letterSpacing: -1,
    fontFamily: "Poppins_400Regular",
  },
  titleTextBold: {
    letterSpacing: -1,
    fontFamily: "Poppins_700Bold",
  },
  iconMoney: {
    position: "absolute",
    top: -25,
    right: -30,
  },
  iconPhone: {
    position: "absolute",
    bottom: -30,
    left: -40,
  },
});
