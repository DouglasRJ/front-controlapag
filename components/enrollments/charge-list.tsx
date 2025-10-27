// components/enrollment/charge-list.tsx
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Charge } from "@/types/charge";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ChargeItem } from "./charge-item";

// --- Componente auxiliar para animar o ícone ---
function AnimatedIcon({ isOpen, color }: { isOpen: boolean; color: string }) {
  const rotation = useSharedValue(isOpen ? -180 : 0);
  useEffect(() => {
    rotation.value = withTiming(isOpen ? -180 : 0, { duration: 250 });
  }, [isOpen, rotation]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <Feather name="chevron-down" size={20} color={color} />
    </Animated.View>
  );
}
// --- ---

type ChargeListProps = {
  charges: Charge[] | undefined | null;
  initialOpen?: boolean;
  onChargePress: (charge: Charge) => void; // Callback para item pressionado
};

export function ChargeList({
  charges,
  initialOpen = false,
  onChargePress,
}: ChargeListProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? "light"].icon;

  const animatedHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const animatedContentStyle = useAnimatedStyle(() => ({
    height: withTiming(animatedHeight.value, { duration: 250 }),
    overflow: "hidden",
  }));

  const measureContentHeight = useCallback(
    (event: LayoutChangeEvent) => {
      runOnUI(() => {
        "worklet";
        const measured = event.nativeEvent.layout.height;
        if (measured > 0 && contentHeight.value !== measured) {
          contentHeight.value = measured;
          if (isOpen) {
            animatedHeight.value = measured; // Ajusta altura se já estava aberto
          }
        }
      })();
    },
    [isOpen, contentHeight, animatedHeight]
  );

  const toggleAccordion = () => {
    const nextIsOpen = !isOpen;
    animatedHeight.value = nextIsOpen ? contentHeight.value : 0;
    setIsOpen(nextIsOpen);
  };

  // Ajusta a altura inicial ou quando o conteúdo muda
  useEffect(() => {
    // Re-mede a altura se a lista de cobranças mudar enquanto aberto
    // (Pode não ser necessário se a altura dos itens for consistente)
    if (isOpen) {
      // Forçar re-medida pode ser complexo, ajuste manual se necessário
      // ou simplifique assumindo altura fixa por item se possível.
      // Por ora, apenas garante que a altura animada corresponda ao estado
      animatedHeight.value = contentHeight.value > 0 ? contentHeight.value : 0;
    } else {
      animatedHeight.value = 0;
    }
  }, [isOpen, contentHeight, animatedHeight, charges]); // Adicionado charges aqui

  const sortedCharges = charges
    ? [...charges].sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      )
    : [];

  // Passa o onChargePress para o ChargeItem
  const renderItem = ({ item }: ListRenderItemInfo<Charge>) => (
    <ChargeItem charge={item} onPress={() => onChargePress(item)} />
  );

  return (
    <View className="w-full bg-card rounded-xl p-4 shadow-sm mt-5">
      {/* Cabeçalho Clicável */}
      <TouchableOpacity
        onPress={toggleAccordion}
        className="flex-row justify-between items-center"
        activeOpacity={0.7}
      >
        <ThemedText className="text-base font-semibold text-card-foreground">
          Histórico de Cobranças ({sortedCharges.length})
        </ThemedText>
        <AnimatedIcon isOpen={isOpen} color={iconColor} />
      </TouchableOpacity>

      {/* Container Animado */}
      <Animated.View style={animatedContentStyle}>
        {/* View Interna para Medição (fora da tela) */}
        <View
          style={{
            position: "absolute",
            opacity: 0,
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
          }}
          onLayout={measureContentHeight}
          pointerEvents="none"
        >
          {sortedCharges.length === 0 ? (
            <View className="items-center py-2 h-10" />
          ) : (
            <>
              {sortedCharges.map((charge) => (
                <View key={charge.id} className="h-[70px] mb-3" /> // Altura estimada para medição
              ))}
            </>
          )}
        </View>

        {/* Conteúdo Real (só renderiza quando aberto) */}
        {isOpen && (
          <View className="mt-4">
            {sortedCharges.length > 0 ? (
              <FlatList
                data={sortedCharges}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // Importante se dentro de ScrollView
              />
            ) : (
              <View className="items-center py-2">
                <ThemedText className="text-muted-foreground">
                  Nenhuma cobrança encontrada.
                </ThemedText>
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
