import { FontPoppins } from "@/constants/font";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { ThemedText } from "../themed-text";

type Option = {
  label: string;
  value: string;
};

type ControlledSelectProps = {
  control: Control<any>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  isMultiple?: boolean;
  disabled?: boolean;
};

export function ControlledSelect({
  control,
  name,
  label,
  options,
  placeholder = "Selecione...",
  isMultiple = false,
  disabled = false,
}: ControlledSelectProps) {
  const { field } = useController({
    control,
    name,
  });

  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "text");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(() => 
    isMultiple ? (field.value || []) : []
  );
  const [selectedValue, setSelectedValue] = useState<string | null>(() => 
    !isMultiple ? (field.value || null) : null
  );

  // Sincroniza com o valor do formulário
  useEffect(() => {
    if (isMultiple) {
      setSelectedValues(field.value || []);
    } else {
      setSelectedValue(field.value || null);
    }
  }, [field.value, isMultiple]);

  const handleSelect = (value: string) => {
    if (isMultiple) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newValues);
      // Não atualiza o formulário imediatamente, só quando confirmar
    } else {
      setSelectedValue(value);
      field.onChange(value);
      setModalVisible(false);
      field.onBlur();
    }
  };

  const handleConfirmMultiple = () => {
    field.onChange(selectedValues);
    field.onBlur();
    setModalVisible(false);
  };

  const handleClose = () => {
    if (isMultiple) {
      // Restaura valores originais se cancelar
      setSelectedValues(field.value || []);
    }
    setModalVisible(false);
  };

  const getDisplayText = () => {
    if (isMultiple) {
      if (selectedValues.length === 0) {
        return placeholder;
      }
      if (selectedValues.length === 1) {
        const option = options.find((opt) => opt.value === selectedValues[0]);
        return option?.label || placeholder;
      }
      return `${selectedValues.length} itens selecionados`;
    } else {
      if (!selectedValue) {
        return placeholder;
      }
      const option = options.find((opt) => opt.value === selectedValue);
      return option?.label || placeholder;
    }
  };

  const isSelected = (value: string) => {
    if (isMultiple) {
      return selectedValues.includes(value);
    }
    return selectedValue === value;
  };

  return (
    <View className="mb-6">
      <ThemedText type="labelInput" style={{ color: textColor, marginBottom: 8 }}>
        {label}
      </ThemedText>
      <Pressable
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        style={[
          styles.selectButton,
          {
            borderLeftColor: textColor,
            backgroundColor: bgColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.selectText,
            {
              color: field.value
                ? textColor
                : borderColor,
            },
          ]}
        >
          {getDisplayText()}
        </Text>
        <Ionicons
          name={modalVisible ? "chevron-up" : "chevron-down"}
          size={20}
          color={textColor}
        />
      </Pressable>

      {/* Badges para múltiplas seleções */}
      {isMultiple && selectedValues.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-2">
          {selectedValues.map((value) => {
            const option = options.find((opt) => opt.value === value);
            if (!option) return null;
            return (
              <View
                key={value}
                style={[
                  styles.badge,
                  {
                    backgroundColor: textColor + "20",
                    borderColor: textColor,
                  },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: textColor }]}
                >
                  {option.label}
                </Text>
                <Pressable
                  onPress={() => handleSelect(value)}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={16} color={textColor} />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={handleClose}
        >
          <Pressable
            style={[
              styles.modalContent,
              {
                backgroundColor: cardColor,
                borderColor: borderColor,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-4 pb-3 border-b" style={{ borderBottomColor: borderColor }}>
              <ThemedText className="text-lg font-bold" style={{ color: textColor }}>
                {label}
              </ThemedText>
              <Pressable onPress={handleClose}>
                <Ionicons name="close" size={24} color={textColor} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.optionsContainer}
              showsVerticalScrollIndicator={true}
            >
              {options.map((option) => {
                const selected = isSelected(option.value);
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: selected
                          ? textColor + "15"
                          : "transparent",
                        borderLeftColor: selected ? textColor : "transparent",
                      },
                    ]}
                  >
                    <View className="flex-row items-center flex-1">
                      {isMultiple && (
                        <View
                          style={[
                            styles.checkbox,
                            {
                              borderColor: selected ? textColor : borderColor,
                              backgroundColor: selected ? textColor : "transparent",
                            },
                          ]}
                        >
                          {selected && (
                            <Ionicons name="checkmark" size={16} color={cardColor} />
                          )}
                        </View>
                      )}
                      {!isMultiple && selected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={textColor}
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: selected ? textColor : textColor,
                            fontWeight: selected ? "600" : "400",
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {isMultiple && (
              <View className="flex-row gap-2 pt-4 border-t" style={{ borderTopColor: borderColor }}>
                <Pressable
                  onPress={handleClose}
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    {
                      borderColor: borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.modalButtonText, { color: textColor }]}>
                    Cancelar
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmMultiple}
                  style={[
                    styles.modalButton,
                    styles.confirmButton,
                    {
                      backgroundColor: textColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: cardColor },
                    ]}
                  >
                    Confirmar ({selectedValues.length})
                  </Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    borderLeftWidth: 4,
    borderRadius: 8,
    height: 49,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 16,
    fontFamily: FontPoppins.REGULAR,
    flex: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FontPoppins.REGULAR,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    marginBottom: 4,
    borderRadius: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
    fontFamily: FontPoppins.REGULAR,
    flex: 1,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  confirmButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: FontPoppins.SEMIBOLD,
  },
});
