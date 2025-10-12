import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/authStore";
import { StyleSheet, View } from "react-native";

export default function ProviderServicesScreen() {
  const { user } = useAuthStore();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ThemedText type="title">Gestão de Serviços</ThemedText>
        <ThemedText>
          Bem-vindo, {user?.username}! Você está na área do Prestador.
        </ThemedText>
        <ThemedText style={{ marginTop: 20, color: "blue" }}>
          *Acesso permitido apenas para PROVEDORES.*
        </ThemedText>
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
    padding: 20,
    backgroundColor: "#333333",
    borderRadius: 10,
    alignItems: "center",
  },
});
