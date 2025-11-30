import React from "react";
import { View, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { OrganizationCard } from "@/components/organization/organization-card";
import { MemberList } from "@/components/organization/member-list";
import { useOrganization } from "@/hooks/use-organization";
import { useOrganizationMembers } from "@/hooks/use-organization-members";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE } from "@/types/user-role";
import { Ionicons } from "@expo/vector-icons";

export default function OrganizationScreen() {
  const { data: organization, isLoading: isLoadingOrg, error: orgError } = useOrganization();
  const { data: members } = useOrganizationMembers();
  const { user } = useAuthStore();

  const isMaster = user?.role === USER_ROLE.MASTER;

  if (isLoadingOrg) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
        <ThemedText className="mt-4 text-foreground/60">Carregando organização...</ThemedText>
      </View>
    );
  }

  if (orgError || !organization) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <View className="items-center">
              <Ionicons name="alert-circle-outline" size={48} className="text-destructive mb-4" />
              <ThemedText className="text-lg font-semibold mb-2">
                Organização não encontrada
              </ThemedText>
              <ThemedText className="text-center text-foreground/60 mb-4">
                Você não possui uma organização ou não tem permissão para acessá-la.
              </ThemedText>
            </View>
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        <View className="max-w-6xl mx-auto w-full gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <ThemedText className="text-3xl font-bold">Organização</ThemedText>
              <ThemedText className="text-foreground/60 mt-1">
                Gerencie sua organização e membros
              </ThemedText>
            </View>
            {isMaster && (
              <View className="flex-row gap-2">
                <Button
                  variant="outline"
                  onPress={() => router.push("/(tabs)/(provider)/organization/members")}
                >
                  <Ionicons name="people-outline" size={18} className="mr-2" />
                  <ThemedText>Ver Membros</ThemedText>
                </Button>
                <Button
                  onPress={() => router.push("/(tabs)/(provider)/organization/invite")}
                >
                  <Ionicons name="person-add-outline" size={18} className="mr-2" />
                  <ThemedText>Convidar</ThemedText>
                </Button>
              </View>
            )}
          </View>

          {/* Organization Card */}
          <OrganizationCard organization={organization} memberCount={members?.length} />

          {/* Quick Actions */}
          {isMaster && (
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Gerencie sua organização e convide novos membros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View className="flex-row gap-3 flex-wrap">
                  <Pressable
                    onPress={() => router.push("/(tabs)/(provider)/organization/invite")}
                    className="flex-1 min-w-[200px] p-4 rounded-lg border border-border bg-card"
                  >
                    <View className="flex-row items-center gap-3 mb-2">
                      <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                        <Ionicons name="person-add" size={20} className="text-primary" />
                      </View>
                      <View className="flex-1">
                        <ThemedText className="font-semibold">Convidar Membro</ThemedText>
                        <ThemedText className="text-sm text-foreground/60">
                          Envie um convite para um Sub-Provider
                        </ThemedText>
                      </View>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push("/(tabs)/(provider)/organization/members")}
                    className="flex-1 min-w-[200px] p-4 rounded-lg border border-border bg-card"
                  >
                    <View className="flex-row items-center gap-3 mb-2">
                      <View className="h-10 w-10 rounded-full bg-secondary/10 items-center justify-center">
                        <Ionicons name="people" size={20} className="text-secondary" />
                      </View>
                      <View className="flex-1">
                        <ThemedText className="font-semibold">Ver Membros</ThemedText>
                        <ThemedText className="text-sm text-foreground/60">
                          Visualize todos os membros da organização
                        </ThemedText>
                      </View>
                    </View>
                  </Pressable>
                </View>
              </CardContent>
            </Card>
          )}

          {/* Recent Members Preview */}
          {members && members.length > 0 && (
            <Card>
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <CardTitle>Membros Recentes</CardTitle>
                  {isMaster && (
                    <Button
                      variant="link"
                      onPress={() => router.push("/(tabs)/(provider)/organization/members")}
                    >
                      <ThemedText>Ver todos</ThemedText>
                    </Button>
                  )}
                </View>
              </CardHeader>
              <CardContent>
                <View className="gap-2">
                  {members.slice(0, 3).map((member) => (
                    <View
                      key={member.id}
                      className="flex-row items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                          <ThemedText className="text-primary font-semibold text-sm">
                            {member.username.charAt(0).toUpperCase()}
                          </ThemedText>
                        </View>
                        <View>
                          <ThemedText className="font-medium">{member.username}</ThemedText>
                          <ThemedText className="text-sm text-foreground/60">
                            {member.email}
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText className="text-sm text-foreground/60">{member.role}</ThemedText>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
