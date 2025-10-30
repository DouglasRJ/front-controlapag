import { useDebounce } from "@/hooks/use-debounce";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ViewProps,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";

type CreateClientByProviderDto = {
  username: string;
  email: string;
  phone: string;
  address: string;
};

type ControlledSearchableSelectProps<T> = {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
  fetchEndpoint: string;
  modalTitle: string;
  initialSelectedName?: string;
  valueAccessor: (item: T) => string;
  displayAccessor: (item: T) => string;
  renderListItem: (item: T) => React.ReactElement;
  allowCreation?: boolean;
  createEndpoint?: string;
} & ViewProps;

export function ControlledSearchableSelect<T>({
  control,
  name,
  label,
  disabled = false,
  fetchEndpoint,
  modalTitle,
  initialSelectedName,
  valueAccessor,
  displayAccessor,
  renderListItem,
  allowCreation = false,
  createEndpoint = "",
  ...viewProps
}: ControlledSearchableSelectProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(initialSelectedName || "");

  const [viewMode, setViewMode] = useState<"search" | "create">("search");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newClientData, setNewClientData] = useState<CreateClientByProviderDto>(
    {
      username: "",
      email: "",
      phone: "",
      address: "",
    }
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const value = useWatch({
    control,
    name,
  });

  useEffect(() => {
    if (initialSelectedName) {
      setDisplayName(initialSelectedName);
    } else if (!value) {
      setDisplayName("");
    }
  }, [value, initialSelectedName]);

  const fetchResults = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await api.get<T[]>(`/${fetchEndpoint}`, {
          params: { search: query },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchEndpoint]
  );

  useEffect(() => {
    if (viewMode === "search") {
      fetchResults(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, fetchResults, viewMode]);

  const resetCreateForm = () => {
    setNewClientData({ username: "", email: "", phone: "", address: "" });
    setCreateError(null);
    setIsCreating(false);
  };

  const openModal = () => {
    if (disabled) return;
    setSearchQuery("");
    setResults([]);
    setViewMode("search");
    resetCreateForm();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCreateFormChange = (
    name: keyof CreateClientByProviderDto,
    text: string
  ) => {
    setNewClientData((prev) => ({ ...prev, [name]: text }));
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur }, fieldState: { error } }) => {
        const handleSelect = (item: T) => {
          onChange(valueAccessor(item));
          setDisplayName(displayAccessor(item));
          onBlur();
          closeModal();
        };

        const handleCreateNewClient = async () => {
          if (!createEndpoint) {
            setCreateError("Endpoint de criação não configurado.");
            return;
          }

          if (!newClientData.username || !newClientData.email) {
            setCreateError("Nome e E-mail são obrigatórios.");
            return;
          }

          setIsCreating(true);
          setCreateError(null);

          try {
            const dto: CreateClientByProviderDto = {
              username: newClientData.username,
              email: newClientData.email,
              phone: newClientData.phone,
              address: newClientData.address,
            };

            const response = await api.post<{ client: T }>(
              `/${createEndpoint}`,
              dto
            );

            const newClient = response.data.client;

            handleSelect(newClient);
          } catch (error: any) {
            console.error("Failed to create client:", error);
            const message =
              error.response?.data?.message || "Erro ao criar cliente.";
            setCreateError(message);
          } finally {
            setIsCreating(false);
          }
        };

        return (
          <View className="w-full mb-4 relative" {...viewProps}>
            {label && (
              <ThemedText type="labelInput" className="text-primary">
                {label}
              </ThemedText>
            )}
            <Pressable
              onPress={openModal}
              disabled={disabled}
              className={`
                border-l-4 rounded-lg bg-light px-3 py-3 flex-row justify-between items-center min-h-[50px]
                ${error ? "border-red-500" : "border-orange-500"}
                ${disabled ? "opacity-50" : ""}
              `}
            >
              <Text
                className={`
                  text-base
                  ${displayName ? "text-card-foreground" : "text-gray-400"}
                `}
              >
                {displayName || `Selecionar ${label?.toLowerCase()}`}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={error ? "#ef4444" : "#F57418"}
              />
            </Pressable>

            {error && (
              <Text className="text-xs mt-1 text-red-500">
                {error.message}
              </Text>
            )}

            <Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={closeModal}
            >
              <SafeAreaView className="flex-1 justify-center bg-black/50">
                <View className="m-5 max-h-[90%] w-[90%] mx-auto rounded-xl overflow-hidden bg-card shadow-lg border-l-4 border-orange-500">
                  <View className="flex-row justify-between items-center p-4 bg-white">
                    <Text className="text-lg font-bold text-card-foreground">
                      {viewMode === "search" ? modalTitle : "Criar Novo Cliente"}
                    </Text>
                    <Pressable onPress={closeModal}>
                      <Ionicons
                        name="close-circle"
                        size={28}
                        color="#9ca3af"
                      />
                    </Pressable>
                  </View>

                  {allowCreation && (
                    <View className="flex-row gap-2 px-4 pb-4 pt-2 bg-white">
                      <Pressable
                        onPress={() => setViewMode("search")}
                        className={`flex-1 py-3 rounded-lg items-center justify-center ${
                          viewMode === "search" ? "bg-orange-500" : "bg-gray-200"
                        }`}
                      >
                        <View className="flex-row items-center gap-2">
                          <Ionicons
                            name="search-outline"
                            size={18}
                            color={viewMode === "search" ? "#fff" : "#6B7280"}
                          />
                          <Text
                            className={`text-center font-bold text-sm ${
                              viewMode === "search"
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          >
                            Buscar
                          </Text>
                        </View>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setViewMode("create");
                          resetCreateForm();
                        }}
                        className={`flex-1 py-3 rounded-lg items-center justify-center ${
                          viewMode === "create" ? "bg-orange-500" : "bg-gray-200"
                        }`}
                      >
                        <View className="flex-row items-center gap-2">
                          <Ionicons
                            name="person-add-outline"
                            size={18}
                            color={viewMode === "create" ? "#fff" : "#6B7280"}
                          />
                          <Text
                            className={`text-center font-bold text-sm ${
                              viewMode === "create"
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          >
                            Criar Novo
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )}

                  {viewMode === "search" && (
                    <>
                      <View className="px-4 pt-4 pb-2 bg-white">
                        <View className="relative">
                          <View className="absolute left-3.5 top-3.5 justify-center z-10">
                            <Ionicons name="search-outline" size={20} color="#9ca3af" />
                          </View>
                          <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Digite para buscar..."
                            placeholderTextColor="#9CA3AF"
                            autoFocus
                            className="border-l-4 border-orange-500 rounded-lg bg-light px-3 py-3 pl-11 text-base text-card-foreground"
                          />
                        </View>
                      </View>

                      {isLoading && (
                        <View className="py-8 bg-white">
                          <ActivityIndicator size="large" color="#F57418" />
                        </View>
                      )}

                      {!isLoading &&
                        results.length === 0 &&
                        debouncedSearchQuery.length > 1 && (
                          <View className="py-8 bg-white">
                            <Text className="text-center text-gray-500 text-sm">
                              Nenhum resultado encontrado.
                            </Text>
                          </View>
                        )}

                      {!isLoading && debouncedSearchQuery.length < 2 && (
                        <View className="py-8 bg-white">
                          <Text className="text-center text-gray-400 text-sm">
                            Digite ao menos 2 caracteres para buscar
                          </Text>
                        </View>
                      )}

                      <FlatList
                        data={results}
                        keyExtractor={(item) => valueAccessor(item)}
                        contentContainerClassName="px-4 gap-3 pb-4 pt-2"
                        className="bg-white"
                        renderItem={({ item }) => (
                          <Pressable
                            onPress={() => handleSelect(item)}
                            className="py-4 px-5 active:bg-gray-100 border-2 border-l-4 border-l-orange-500 rounded-lg border-gray-200 bg-light"
                          >
                            {renderListItem(item)}
                          </Pressable>
                        )}
                      />
                    </>
                  )}

                  {viewMode === "create" && (
                    <ScrollView className="max-h-[60vh] bg-white">
                      <View className="px-4 pb-4 gap-4">
                        <SimpleInput
                          label="Nome Completo"
                          icon="person-outline"
                          placeholder="João Silva"
                          value={newClientData.username}
                          onChangeText={(t) =>
                            handleCreateFormChange("username", t)
                          }
                        />
                        <SimpleInput
                          label="E-mail"
                          icon="mail-outline"
                          placeholder="joao@email.com"
                          value={newClientData.email}
                          onChangeText={(t) =>
                            handleCreateFormChange("email", t)
                          }
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                        <SimpleInput
                          label="Telefone"
                          icon="call-outline"
                          placeholder="(11) 98765-4321"
                          value={newClientData.phone}
                          onChangeText={(t) =>
                            handleCreateFormChange("phone", t)
                          }
                          keyboardType="phone-pad"
                          maskType="phone"
                        />
                        <SimpleInput
                          label="Endereço"
                          icon="location-outline"
                          placeholder="Rua, número, bairro"
                          value={newClientData.address}
                          onChangeText={(t) =>
                            handleCreateFormChange("address", t)
                          }
                        />

                        {createError && (
                          <View className="bg-[#FEE2E2] p-4 rounded-lg border border-[#F87171]">
                            <Text className="text-[#B91C1C] text-center font-medium text-xs">
                              {createError}
                            </Text>
                          </View>
                        )}

                        <Pressable
                          onPress={handleCreateNewClient}
                          disabled={isCreating}
                          className={`bg-orange-500 rounded-xl py-3.5 items-center justify-center shadow-lg shadow-orange-500/30 mt-2 ${
                            isCreating ? "opacity-70" : "active:bg-orange-600"
                          }`}
                        >
                          {isCreating ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text className="text-white text-base font-bold tracking-wide">
                              SALVAR E SELECIONAR CLIENTE
                            </Text>
                          )}
                        </Pressable>
                      </View>
                    </ScrollView>
                  )}
                </View>
              </SafeAreaView>
            </Modal>
          </View>
        );
      }}
    />
  );
}

type SimpleInputProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  maskType?: "phone";
} & React.ComponentProps<typeof TextInput>;

function SimpleInput({
  label,
  icon,
  value,
  onChangeText,
  maskType,
  ...props
}: SimpleInputProps) {
  if (maskType === "phone") {
    return (
      <View className="gap-1">
        <Text className="text-sm font-semibold text-card-foreground mb-1">
          {label}
        </Text>
        <View className="relative">
          <View className="absolute left-3.5 top-3.5 justify-center z-10">
            <Ionicons name={icon} size={20} color="#9ca3af" />
          </View>
          <MaskInput
            value={value}
            onChangeText={onChangeText}
            mask={Masks.BRL_PHONE}
            placeholderTextColor="#9CA3AF"
            className="border-l-4 border-orange-500 rounded-lg bg-light px-3 py-3 pl-11 text-base text-card-foreground"
            {...props}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="gap-1">
      <Text className="text-sm font-semibold text-card-foreground mb-1">
        {label}
      </Text>
      <View className="relative">
        <View className="absolute left-3.5 top-3.5 justify-center z-10">
          <Ionicons name={icon} size={20} color="#9ca3af" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#9CA3AF"
          className="border-l-4 border-orange-500 rounded-lg bg-light px-3 py-3 pl-11 text-base text-card-foreground"
          {...props}
        />
      </View>
    </View>
  );
}
