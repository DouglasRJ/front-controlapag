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
  // Cores semânticas para feedback e status
  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    500: "#22C55E",
    600: "#16A34A",
  },
  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    500: "#F59E0B",
    600: "#D97706",
  },
  error: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    500: "#EF4444",
    600: "#DC2626",
  },
  info: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    500: "#3B82F6",
    600: "#2563EB",
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
        
        // Cores semânticas
        success: {
          50: palette.success[50],
          100: palette.success[100],
          500: palette.success[500],
          600: palette.success[600],
        },
        warning: {
          50: palette.warning[50],
          100: palette.warning[100],
          500: palette.warning[500],
          600: palette.warning[600],
        },
        error: {
          50: palette.error[50],
          100: palette.error[100],
          500: palette.error[500],
          600: palette.error[600],
        },
        info: {
          50: palette.info[50],
          100: palette.info[100],
          500: palette.info[500],
          600: palette.info[600],
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
        
        // Cores semânticas (mesmas para dark mode)
        success: {
          50: palette.success[50],
          100: palette.success[100],
          500: palette.success[500],
          600: palette.success[600],
        },
        warning: {
          50: palette.warning[50],
          100: palette.warning[100],
          500: palette.warning[500],
          600: palette.warning[600],
        },
        error: {
          50: palette.error[50],
          100: palette.error[100],
          500: palette.error[500],
          600: palette.error[600],
        },
        info: {
          50: palette.info[50],
          100: palette.info[100],
          500: palette.info[500],
          600: palette.info[600],
        },
      },
      fontFamily: {
        // Poppins (mantido para compatibilidade)
        thin: ["Poppins_100Thin"],
        light: ["Poppins_300Light"],
        regular: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
        black: ["Poppins_900Black"],
        // Inter (preferido para o novo design system)
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      spacing: {
        xs: "0.25rem", // 4px
        sm: "0.5rem", // 8px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
        "2xl": "3rem", // 48px
        "3xl": "4rem", // 64px
      },
      borderRadius: {
        none: "0",
        sm: "0.375rem", // 6px
        md: "0.5rem", // 8px
        lg: "0.75rem", // 12px
        xl: "1rem", // 16px
        "2xl": "1.5rem", // 24px
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
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
