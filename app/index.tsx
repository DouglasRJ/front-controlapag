import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const COLORS = {
  primary: "#F57418",
  secondary: "#f1f1f1ff",
};

export default function Home() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleContainer}>
          <ThemedText
            style={styles.titleText}
            lightColor={COLORS.primary}
            darkColor={COLORS.primary}
          >
            Controla
          </ThemedText>
          <ThemedText
            style={styles.titleTextBold}
            lightColor={COLORS.primary}
            darkColor={COLORS.primary}
          >
            PAG
          </ThemedText>
          <View style={styles.iconMoney}>
            <MaterialIcons
              name="attach-money"
              size={32}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.iconPhone}>
            <MaterialCommunityIcons
              name="cellphone-message"
              size={32}
              color={COLORS.primary}
            />
          </View>
        </View>

        <View style={styles.subtitleContainer}>
          <ThemedText
            style={styles.subtitleText}
            lightColor={COLORS.secondary}
            darkColor={COLORS.secondary}
          >
            Menos cobrança manual. Mais tempo para crescer
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    position: "relative",
  },
  titleText: {
    fontSize: 52,
    letterSpacing: -1,
    fontWeight: "300",
  },
  titleTextBold: {
    fontSize: 52,
    letterSpacing: -1,
    fontWeight: "bold",
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
  subtitleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 24,
    textAlign: "center",
  },
});
