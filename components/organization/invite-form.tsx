import React from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { ControlledInput } from "@/components/forms/controlled-input";
import { useInviteSubProvider } from "@/hooks/use-invite-sub-provider";
import { useOrganization } from "@/hooks/use-organization";

const inviteSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteFormProps {
  onSuccess?: () => void;
}

export function InviteForm({ onSuccess }: InviteFormProps) {
  const { data: organization } = useOrganization();
  const inviteMutation = useInviteSubProvider();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: InviteFormData) => {
    if (!organization?.id) {
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        organizationId: organization.id,
        data,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convidar Sub-Provider</CardTitle>
        <CardDescription>
          Envie um convite para um novo membro se juntar à sua organização como Sub-Provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="space-y-4">
          <View>
            <ThemedText className="text-sm font-medium mb-2">Nome do Convidado</ThemedText>
            <ControlledInput
              control={control}
              name="name"
              placeholder="Nome completo"
              autoCapitalize="words"
            />
            {errors.name && (
              <ThemedText className="text-sm text-destructive mt-1">
                {errors.name.message}
              </ThemedText>
            )}
          </View>

          <View>
            <ThemedText className="text-sm font-medium mb-2">Email</ThemedText>
            <ControlledInput
              control={control}
              name="email"
              placeholder="email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && (
              <ThemedText className="text-sm text-destructive mt-1">
                {errors.email.message}
              </ThemedText>
            )}
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || inviteMutation.isPending}
            className="w-full"
          >
            {isSubmitting || inviteMutation.isPending ? (
              <ThemedText>Enviando...</ThemedText>
            ) : (
              <ThemedText>Enviar Convite</ThemedText>
            )}
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}

