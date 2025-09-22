/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // Primary colors (워크소스 브랜드 컬러)
        primary: {
          50: "oklch(97.2% 0.043 47.604)",
          100: "oklch(93.8% 0.085 47.604)",
          200: "oklch(87.1% 0.128 47.604)",
          300: "oklch(78.9% 0.170 47.604)",
          400: "oklch(74.7% 0.192 47.604)",
          500: "oklch(70.5% 0.213 47.604)", // 기본 Primary
          600: "oklch(63.4% 0.191 47.604)",
          700: "oklch(52.8% 0.159 47.604)",
          800: "oklch(43.6% 0.131 47.604)",
          900: "oklch(35.9% 0.108 47.604)",
        },
        // Secondary colors (Blue-Gray 계열)
        secondary: {
          50: "oklch(97.6% 0.011 252.8)",
          100: "oklch(94.1% 0.022 252.8)",
          200: "oklch(88.4% 0.034 252.8)",
          300: "oklch(79.9% 0.045 252.8)",
          400: "oklch(73.4% 0.051 252.8)",
          500: "oklch(66.8% 0.056 252.8)", // 기본 Secondary
          600: "oklch(58.5% 0.050 252.8)",
          700: "oklch(48.4% 0.042 252.8)",
          800: "oklch(39.7% 0.034 252.8)",
          900: "oklch(32.3% 0.028 252.8)",
        },
        // Neutral colors (Gray Scale)
        neutral: {
          50: "oklch(98.5% 0.003 286)",
          100: "oklch(96.2% 0.006 286)",
          200: "oklch(92.4% 0.011 286)",
          300: "oklch(86.8% 0.017 286)",
          400: "oklch(69.8% 0.023 286)",
          500: "oklch(58.7% 0.019 286)",
          600: "oklch(48.6% 0.015 286)",
          700: "oklch(40.1% 0.012 286)",
          800: "oklch(27.8% 0.008 286)",
          900: "oklch(16.9% 0.005 286)",
        },
        // Status colors
        success: {
          DEFAULT: "oklch(65.7% 0.176 142.5)",
          bg: "oklch(95.8% 0.035 142.5)",
          border: "oklch(85.2% 0.106 142.5)",
        },
        warning: {
          DEFAULT: "oklch(78.2% 0.137 85.4)",
          bg: "oklch(97.1% 0.027 85.4)",
          border: "oklch(88.9% 0.082 85.4)",
        },
        error: {
          DEFAULT: "oklch(63.2% 0.176 22.2)",
          bg: "oklch(96.8% 0.035 22.2)",
          border: "oklch(86.3% 0.106 22.2)",
        },
        info: {
          DEFAULT: "oklch(69.5% 0.123 252.8)",
          bg: "oklch(96.3% 0.025 252.8)",
          border: "oklch(84.7% 0.074 252.8)",
        },
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
        "5xl": "3rem", // 48px
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },
      spacing: {
        "1": "0.25rem", // 4px
        "2": "0.5rem", // 8px
        "3": "0.75rem", // 12px
        "4": "1rem", // 16px
        "5": "1.25rem", // 20px
        "6": "1.5rem", // 24px
        "8": "2rem", // 32px
        "10": "2.5rem", // 40px
        "12": "3rem", // 48px
        "16": "4rem", // 64px
        "20": "5rem", // 80px
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      transitionDuration: {
        fast: "0.15s",
        base: "0.2s",
        slow: "0.3s",
      },
      transitionTimingFunction: {
        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
        "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
      },
    },
  },
  plugins: [],
};
