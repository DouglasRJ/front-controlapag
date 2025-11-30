import React from "react";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Organization } from "@/types/organization";
import { formatDate } from "@/utils/format-date";

interface OrganizationCardProps {
  organization: Organization;
  memberCount?: number;
}

export function OrganizationCard({ organization, memberCount }: OrganizationCardProps) {
  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center justify-between mb-2">
          <CardTitle className="text-2xl">{organization.name}</CardTitle>
          <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
            <Ionicons name="business" size={24} className="text-primary" />
          </View>
        </View>
        <CardDescription>
          Organização criada em {formatDate(organization.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="space-y-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="people-outline" size={18} className="text-foreground/60" />
            <ThemedText className="text-sm text-foreground/60">
              {memberCount !== undefined
                ? `${memberCount} ${memberCount === 1 ? "membro" : "membros"}`
                : "Carregando..."}
            </ThemedText>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} className="text-foreground/60" />
            <ThemedText className="text-sm text-foreground/60">
              Atualizado em {formatDate(organization.updatedAt)}
            </ThemedText>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

