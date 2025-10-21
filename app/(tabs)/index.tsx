import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FontPoppins } from "@/constants/font";
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
            Menos cobrança manual. Mais tempo para crescer.
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
    gap: 20,
    position: "relative",
  },
  subtitleContainer: {
    textAlign: "center",
    position: "absolute",
    marginTop: 150,
    paddingHorizontal: 40,
  },
  subtitleText: {
    fontSize: 14,
    letterSpacing: 0.5,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: FontPoppins.EXTRALIGHT,
  },
});
