import { FontPoppins } from "@/constants/font";
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

  const iconSize = fontSize * 0.5;
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
    fontFamily: FontPoppins.LIGHT,
  },
  titleTextBold: {
    letterSpacing: -1,
    fontFamily: FontPoppins.SEMIBOLD,
  },
  iconMoney: {
    position: "absolute",
    top: -45,
    right: 0,
  },
  iconPhone: {
    position: "absolute",
    bottom: -45,
    left: 5,
  },
});
