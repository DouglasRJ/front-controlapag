import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { MemberList } from "@/components/organization/member-list";
import { Ionicons } from "@expo/vector-icons";

export default function OrganizationMembersScreen() {
  const handleRemove = (memberId: string) => {
    // TODO: Implement remove member functionality
    console.log("Remove member:", memberId);
  };

  const handleEditRole = (memberId: string) => {
    // TODO: Implement edit role functionality
    console.log("Edit role for member:", memberId);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        <View className="max-w-6xl mx-auto w-full gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => router.back()}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <Ionicons name="arrow-back" size={24} />
              </Pressable>
              <View>
                <ThemedText className="text-3xl font-bold">Membros da Organização</ThemedText>
                <ThemedText className="text-foreground/60 mt-1">
                  Gerencie os membros da sua organização
                </ThemedText>
              </View>
            </View>
            <Button
              onPress={() => router.push("/(tabs)/(provider)/organization/invite")}
            >
              <Ionicons name="person-add-outline" size={18} className="mr-2" />
              <ThemedText>Convidar Novo Membro</ThemedText>
            </Button>
          </View>

          {/* Member List */}
          <MemberList onRemove={handleRemove} onEditRole={handleEditRole} />
        </View>
      </ScrollView>
    </View>
  );
}

