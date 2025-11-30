import React from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemedText } from "@/components/themed-text";
import { MemberRow } from "./member-row";
import { OrganizationMember } from "@/types/organization";
import { useOrganization } from "@/hooks/use-organization";
import { useOrganizationMembers } from "@/hooks/use-organization-members";
import { useAuthStore } from "@/store/authStore";

interface MemberListProps {
  onRemove?: (memberId: string) => void;
  onEditRole?: (memberId: string) => void;
}

export function MemberList({ onRemove, onEditRole }: MemberListProps) {
  const { data: organization } = useOrganization();
  const { data: members, isLoading, error } = useOrganizationMembers();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" />
            <ThemedText className="mt-4 text-foreground/60">Carregando membros...</ThemedText>
          </View>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <View className="items-center justify-center py-8">
            <ThemedText className="text-destructive">
              Erro ao carregar membros. Tente novamente.
            </ThemedText>
          </View>
        </CardContent>
      </Card>
    );
  }

  if (!members || members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membros da Organização</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="items-center justify-center py-8">
            <ThemedText className="text-foreground/60">
              Nenhum membro encontrado.
            </ThemedText>
          </View>
        </CardContent>
      </Card>
    );
  }

  const ownerId = organization?.ownerId || user?.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros da Organização</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Membro</TableHead>
                <TableHead className="min-w-[120px]">Função</TableHead>
                <TableHead className="min-w-[150px]">Data de Entrada</TableHead>
                <TableHead className="min-w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isOwner={member.id === ownerId}
                  onRemove={onRemove}
                  onEditRole={onEditRole}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollView>
      </CardContent>
    </Card>
  );
}

