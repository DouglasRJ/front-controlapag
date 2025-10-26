import { useDebounce } from "@/hooks/use-debounce";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";

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
  ...viewProps
}: ControlledSearchableSelectProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(initialSelectedName || "");

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
    fetchResults(debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchResults]);

  const openModal = () => {
    if (disabled) return;
    setSearchQuery("");
    setResults([]);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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

        return (
          <View className="w-full mb-4 relative" {...viewProps}>
            {label && (
              <ThemedText type="labelInput" className="text-primary">
                {label}
              </ThemedText>
            )}
            <View className="relative">
              <Pressable
                onPress={openModal}
                disabled={disabled}
                className={`
                  border-l-4 rounded-lg bg-light px-3 py-3 flex-row justify-between items-center min-h-[50px]
                   
                  ${error ? "border-destructive" : "border-primary"} 
                  ${disabled ? "opacity-50" : ""}
                `}
                style={[Platform.OS === "web" && { outline: "none" }]}
              >
                <ThemedText
                  className={`
                    text-base 
                    ${displayName ? "text-black" : "text-muted-foreground"}
                  `}
                >
                  {displayName || `Selecionar ${label?.toLowerCase()}`}
                </ThemedText>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  className={error ? "text-destructive" : "text-primary"}
                />
              </Pressable>
            </View>

            {error && (
              <Text className="text-xs absolute -bottom-5 left-2.5 text-destructive">
                {error.message}
              </Text>
            )}

            <Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={closeModal}
            >
              <SafeAreaView className="flex-1  justify-center bg-black/50">
                <View
                  className="m-5 max-h-[80%] w-[80%] justify-center mx-auto rounded-xl overflow-hidden bg-card shadow-lg 
                             border-l-4 border-primary gap-4"
                >
                  <View className="flex-row justify-between items-center p-4">
                    <ThemedText type="subtitle" className="text-foreground">
                      {modalTitle}
                    </ThemedText>
                    <Pressable onPress={closeModal}>
                      <Ionicons
                        name="close-circle"
                        size={24}
                        className="text-muted-foreground"
                      />
                    </Pressable>
                  </View>
                  <View className="border-b border-primary pb-4">
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Digite para buscar..."
                      placeholderTextColor="#9CA3AF"
                      autoFocus
                      className="h-11 rounded-lg px-3 text-base mx-4 mb-4 bg-input text-foreground border-l-4 border-primary"
                      style={[Platform.OS === "web" && { outline: "none" }]}
                    />
                  </View>

                  {isLoading && (
                    <ActivityIndicator
                      size="large"
                      className="my-5 text-primary"
                    />
                  )}

                  {!isLoading &&
                    results.length === 0 &&
                    debouncedSearchQuery.length > 1 && (
                      <ThemedText className="text-center text-muted-foreground my-5">
                        Nenhum resultado encontrado.
                      </ThemedText>
                    )}

                  <FlatList
                    data={results}
                    keyExtractor={(item) => valueAccessor(item)}
                    contentContainerClassName="px-12 gap-4 pb-12 pt-4"
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => handleSelect(item)}
                        className="py-4 px-5  min-w-[80%] active:bg-muted border-2 border-l-4 border-l-primary rounded-lg border-dark/20"
                      >
                        {renderListItem(item)}
                      </Pressable>
                    )}
                  />
                </View>
              </SafeAreaView>
            </Modal>
          </View>
        );
      }}
    />
  );
}
