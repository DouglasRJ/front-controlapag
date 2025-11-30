import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { InviteForm } from "@/components/organization/invite-form";
import { Ionicons } from "@expo/vector-icons";

export default function InviteSubProviderScreen() {
  const handleSuccess = () => {
    // Navigate back to organization page after successful invite
    router.push("/(tabs)/(provider)/organization");
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        <View className="max-w-2xl mx-auto w-full gap-6">
          {/* Header */}
          <View className="flex-row items-center gap-3 mb-4">
            <Pressable
              onPress={() => router.back()}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Ionicons name="arrow-back" size={24} />
            </Pressable>
            <View>
              <ThemedText className="text-3xl font-bold">Convidar Sub-Provider</ThemedText>
              <ThemedText className="text-foreground/60 mt-1">
                Envie um convite para um novo membro se juntar à organização
              </ThemedText>
            </View>
          </View>

          {/* Invite Form */}
          <InviteForm onSuccess={handleSuccess} />
        </View>
      </ScrollView>
    </View>
  );
}

