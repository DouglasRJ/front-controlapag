import React from "react";
import { View, Pressable } from "react-native";
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemedText } from "@/components/themed-text";
import { OrganizationMember } from "@/types/organization";
import { USER_ROLE } from "@/types/user-role";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/format-date";

interface MemberRowProps {
  member: OrganizationMember;
  isOwner?: boolean;
  onRemove?: (memberId: string) => void;
  onEditRole?: (memberId: string) => void;
}

const roleLabels: Record<string, string> = {
  [USER_ROLE.MASTER]: "Proprietário",
  [USER_ROLE.SUB_PROVIDER]: "Sub-Provider",
  [USER_ROLE.PROVIDER]: "Provider",
  [USER_ROLE.INDIVIDUAL]: "Individual",
};

const roleColors: Record<string, string> = {
  [USER_ROLE.MASTER]: "bg-primary/10 text-primary border-primary/20",
  [USER_ROLE.SUB_PROVIDER]: "bg-secondary/10 text-secondary border-secondary/20",
  [USER_ROLE.PROVIDER]: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  [USER_ROLE.INDIVIDUAL]: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20",
};

export function MemberRow({
  member,
  isOwner = false,
  onRemove,
  onEditRole,
}: MemberRowProps) {
  const roleLabel = roleLabels[member.role] || member.role;
  const roleColor = roleColors[member.role] || "bg-neutral-500/10 text-neutral-600 border-neutral-500/20";

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <View className="flex-row items-center gap-3">
          <Avatar
            src={member.image}
            fallback={member.username.charAt(0).toUpperCase()}
            className="h-10 w-10"
          />
          <View>
            <ThemedText className="font-medium">{member.username}</ThemedText>
            <ThemedText className="text-sm text-foreground/60">{member.email}</ThemedText>
          </View>
        </View>
      </TableCell>
      <TableCell>
        <Badge className={roleColor}>
          {roleLabel}
        </Badge>
      </TableCell>
      <TableCell>
        <ThemedText className="text-sm text-foreground/60">
          {formatDate(member.createdAt)}
        </ThemedText>
      </TableCell>
      <TableCell>
        <View className="flex-row items-center gap-2">
          {!isOwner && onEditRole && (
            <Pressable
              onPress={() => onEditRole(member.id)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Ionicons name="pencil-outline" size={18} className="text-foreground/60" />
            </Pressable>
          )}
          {!isOwner && onRemove && (
            <Pressable
              onPress={() => onRemove(member.id)}
              className="p-2 rounded-lg hover:bg-destructive/10"
            >
              <Ionicons name="trash-outline" size={18} className="text-destructive" />
            </Pressable>
          )}
        </View>
      </TableCell>
    </TableRow>
  );
}

