const tintColor = "#F57418";

const Colors = {
  light: {
    text: "#242120",
    background: "#ECEDEE",
    tint: tintColor,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColor,
    card: "#f9f9f9",
    border: "#2421204a",
  },
  dark: {
    text: "#ECEDEE",
    background: "#242120",
    tint: tintColor,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColor,
    card: "#f9f9f9",
    border: "#f9f9f9",
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: Colors.light.background,
        foreground: Colors.light.text,
        primary: {
          DEFAULT: Colors.light.tint,
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: Colors.light.card,
          foreground: Colors.light.text,
        },
        borderColor: Colors.light.border,
        icon: Colors.light.icon,
        tabIcon: {
          DEFAULT: Colors.light.tabIconDefault,
          selected: Colors.light.tabIconSelected,
        },
      },
      darkColors: {
        background: Colors.dark.background,
        foreground: Colors.dark.text,
        primary: {
          DEFAULT: Colors.dark.tint,
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: Colors.dark.card,
          foreground: Colors.light.text,
        },
        borderColor: Colors.dark.border,
        icon: Colors.dark.icon,
        tabIcon: {
          DEFAULT: Colors.dark.tabIconDefault,
          selected: Colors.dark.tabIconSelected,
        },
      },
      fontFamily: {
        thin: ["Poppins_100Thin"],
        "thin-italic": ["Poppins_100Thin_Italic"],
        extralight: ["Poppins_200ExtraLight"],
        light: ["Poppins_300Light"],
        regular: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
        extrabold: ["Poppins_800ExtraBold"],
        black: ["Poppins_900Black"],
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme, e }) {
      const darkColors = theme("darkColors");
      const utilities = Object.keys(darkColors).map((key) => {
        if (typeof darkColors[key] === "object") {
          return Object.keys(darkColors[key])
            .map((subKey) => {
              const classNameSuffix = subKey === "DEFAULT" ? "" : `-${subKey}`;
              return {
                [`.dark .bg-${key}${classNameSuffix}`]: {
                  backgroundColor: darkColors[key][subKey],
                },
                [`.dark .text-${key}${classNameSuffix}`]: {
                  color: darkColors[key][subKey],
                },
                [`.dark .border-${key}${classNameSuffix}`]: {
                  borderColor: darkColors[key][subKey],
                },
              };
            })
            .reduce((acc, val) => Object.assign(acc, val), {});
        } else {
          return {
            [`.dark .bg-${key}`]: { backgroundColor: darkColors[key] },
            [`.dark .text-${key}`]: { color: darkColors[key] },
            [`.dark .border-${key}`]: { borderColor: darkColors[key] },
          };
        }
      });
      addUtilities(utilities);
    },
  ],
};
