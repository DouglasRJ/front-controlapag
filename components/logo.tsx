import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { ThemedText } from "./themed-text";

type LogoProps = {
  fontSize?: number;
  showIcon?: boolean;
  hasMargin?: boolean;
};

export const Logo = ({
  fontSize = 52,
  showIcon = false,
  hasMargin = false,
}: LogoProps) => {
  const iconSize = fontSize * 0.5;
  const containerMarginBottom = hasMargin ? fontSize * 0.9 : 0;

  return (
    <View
      className="flex-row items-center justify-center relative"
      style={{ marginBottom: containerMarginBottom }}
    >
      <ThemedText className="text-primary" style={{ fontSize: fontSize }}>
        Controla
      </ThemedText>
      <ThemedText
        className=" text-primary font-bold"
        style={{ fontSize: fontSize }}
      >
        PAG
      </ThemedText>

      {showIcon && (
        <>
          <View className="absolute top-[-45px] right-0">
            <MaterialIcons
              name="attach-money"
              size={iconSize}
              className="text-primary"
            />
          </View>
          <View className="absolute bottom-[-45px] left-[5px]">
            <MaterialCommunityIcons
              name="cellphone-message"
              size={iconSize}
              className="text-primary"
            />
          </View>
        </>
      )}
    </View>
  );
};
