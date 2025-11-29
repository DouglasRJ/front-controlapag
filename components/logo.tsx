import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image, useColorScheme, View } from "react-native";
// import a from "../assets/images/logos"
const LogoAllBlack = require("../assets/images/logos/controlapag-allblack.png");
const LogoFullPrimary = require("../assets/images/logos/controlapag-fullprimary.png");

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

  const theme = useColorScheme();

  const logoSource = theme === "dark" ? LogoFullPrimary : LogoAllBlack;

  return (
    <View
      className="flex-row items-center justify-center relative"
      style={{ marginBottom: containerMarginBottom }}
    >
      <Image
        source={logoSource}
        style={{
          height: fontSize,
          width: fontSize * 4,
        }}
        resizeMode="contain"
      />

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
