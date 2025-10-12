import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet, View } from "react-native";

const COLORS = {
  primary: "#F57418",
  secondary: "#f1f1f1ff",
};

export default function Home() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.contentWrapper}>
       <Logo showIcon />

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
    color: "#F57418"
  },
  titleTextBold: {
    fontSize: 52,
    letterSpacing: -1,
    fontWeight: "bold",
    color: "#F57418"
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
