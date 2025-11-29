/** @type {import('tailwindcss').Config} */

const palette = {
  orange: {
    DEFAULT: "#FD5001", // Cor principal
    dark: "#AF340B",    // Cor premium
    // Escala derivada da cor principal
    50: "#FFF4ED",
    100: "#FFE5D4",
    200: "#FFC7A8",
    300: "#FF9F71",
    400: "#FF6B3D",
    500: "#FD5001", // Principal
    600: "#E64500",
    700: "#CC3C00",
    800: "#B33300",
    900: "#992B00",
  },
  yellow: {
    DEFAULT: "#F29C11", // Amarelo auxiliar
    // Escala derivada do amarelo auxiliar
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F29C11", // Auxiliar
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },
  premium: {
    DEFAULT: "#AF340B", // Cor premium
    // Escala derivada da cor premium
    50: "#FFF1F2",
    100: "#FFE4E6",
    200: "#FECDD3",
    300: "#FDA4AF",
    400: "#FB7185",
    500: "#AF340B", // Premium
    600: "#9F2E0A",
    700: "#8F2809",
    800: "#7F2208",
    900: "#6F1C07",
  },
  neutral: {
    black: "#000000",
    white: "#FFFFFF",
    offWhite: "#F5F5F5",
    darkGray: "#1C1C1E",
    // Escala completa para textos e backgrounds
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0A0A0A",
  },
};

const Colors = {
  light: {
    background: palette.neutral.offWhite,
    foreground: palette.neutral.black,

    card: palette.neutral.white,
    cardForeground: palette.neutral.black,

    primary: palette.orange.DEFAULT, // #FD5001
    primaryForeground: palette.neutral.white,

    secondary: palette.yellow.DEFAULT, // #F29C11
    secondaryForeground: palette.neutral.black,

    premium: palette.premium.DEFAULT, // #AF340B
    premiumForeground: palette.neutral.white,

    accent: palette.orange.dark,
    border: "#E5E5E5",
    input: "#E5E5E5",
  },
  dark: {
    background: palette.neutral.black,
    foreground: palette.neutral.offWhite,

    card: palette.neutral.darkGray,
    cardForeground: palette.neutral.white,

    primary: palette.orange.DEFAULT, // #FD5001
    primaryForeground: palette.neutral.white,

    secondary: palette.yellow.DEFAULT, // #F29C11
    secondaryForeground: palette.neutral.black,

    premium: palette.premium.DEFAULT, // #AF340B
    premiumForeground: palette.neutral.white,

    accent: palette.orange.dark,
    border: palette.orange.dark,
    input: palette.neutral.darkGray,
  },
};

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Cores da marca
        brand: palette.orange.DEFAULT, // #FD5001
        premium: palette.premium.DEFAULT, // #AF340B
        warning: palette.yellow.DEFAULT, // #F29C11

        // Escalas completas (para usar primary-100, primary-200, etc)
        primary: {
          50: palette.orange[50],
          100: palette.orange[100],
          200: palette.orange[200],
          300: palette.orange[300],
          400: palette.orange[400],
          DEFAULT: palette.orange.DEFAULT, // #FD5001
          600: palette.orange[600],
          700: palette.orange[700],
          800: palette.orange[800],
          900: palette.orange[900],
          foreground: Colors.light.primaryForeground,
        },
        secondary: {
          50: palette.yellow[50],
          100: palette.yellow[100],
          200: palette.yellow[200],
          300: palette.yellow[300],
          400: palette.yellow[400],
          DEFAULT: palette.yellow.DEFAULT, // #F29C11
          600: palette.yellow[600],
          700: palette.yellow[700],
          800: palette.yellow[800],
          900: palette.yellow[900],
          foreground: Colors.light.secondaryForeground,
        },
        premium: {
          50: palette.premium[50],
          100: palette.premium[100],
          200: palette.premium[200],
          300: palette.premium[300],
          400: palette.premium[400],
          DEFAULT: palette.premium.DEFAULT, // #AF340B
          600: palette.premium[600],
          700: palette.premium[700],
          800: palette.premium[800],
          900: palette.premium[900],
          foreground: Colors.light.premiumForeground,
        },
        
        // Tokens de UI
        background: Colors.light.background,
        foreground: Colors.light.foreground,
        card: {
          DEFAULT: Colors.light.card,
          foreground: Colors.light.cardForeground,
        },
        border: Colors.light.border,
        accent: Colors.light.accent,
        
        // Neutrals
        neutral: {
          50: palette.neutral[50],
          100: palette.neutral[100],
          200: palette.neutral[200],
          300: palette.neutral[300],
          400: palette.neutral[400],
          500: palette.neutral[500],
          600: palette.neutral[600],
          700: palette.neutral[700],
          800: palette.neutral[800],
          900: palette.neutral[900],
          950: palette.neutral[950],
        },
      },
      darkColors: {
        background: Colors.dark.background,
        foreground: Colors.dark.foreground,

        primary: {
          50: palette.orange[50],
          100: palette.orange[100],
          200: palette.orange[200],
          300: palette.orange[300],
          400: palette.orange[400],
          DEFAULT: Colors.dark.primary, // #FD5001
          600: palette.orange[600],
          700: palette.orange[700],
          800: palette.orange[800],
          900: palette.orange[900],
          foreground: Colors.dark.primaryForeground,
        },
        secondary: {
          50: palette.yellow[50],
          100: palette.yellow[100],
          200: palette.yellow[200],
          300: palette.yellow[300],
          400: palette.yellow[400],
          DEFAULT: Colors.dark.secondary, // #F29C11
          600: palette.yellow[600],
          700: palette.yellow[700],
          800: palette.yellow[800],
          900: palette.yellow[900],
          foreground: Colors.dark.secondaryForeground,
        },
        premium: {
          50: palette.premium[50],
          100: palette.premium[100],
          200: palette.premium[200],
          300: palette.premium[300],
          400: palette.premium[400],
          DEFAULT: Colors.dark.premium, // #AF340B
          600: palette.premium[600],
          700: palette.premium[700],
          800: palette.premium[800],
          900: palette.premium[900],
          foreground: Colors.dark.premiumForeground,
        },
        
        card: {
          DEFAULT: Colors.dark.card,
          foreground: Colors.dark.cardForeground,
        },
        border: Colors.dark.border,
        accent: Colors.dark.accent,
      },
      fontFamily: {
        thin: ["Poppins_100Thin"],
        light: ["Poppins_300Light"],
        regular: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        bold: ["Poppins_700Bold"],
        black: ["Poppins_900Black"],
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
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
