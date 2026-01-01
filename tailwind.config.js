/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6B35", // Primary Orange
          foreground: "#FFFFFF",
          50: "#FFF4F0",
          100: "#FFE9E0",
          200: "#FFD3C1",
          300: "#FFBDA2",
          400: "#FFA783",
          500: "#FF6B35", // Main
          600: "#E85F2F",
          700: "#CC5329",
          800: "#B04723",
          900: "#943B1D",
        },
        navy: {
          DEFAULT: "#004E89", // Navy Blue
          50: "#E6F0F7",
          100: "#CCE1EF",
          200: "#99C3DF",
          300: "#66A5CF",
          400: "#3387BF",
          500: "#004E89", // Main
          600: "#00457A",
          700: "#003C6B",
          800: "#00335C",
          900: "#002A4D",
          950: "#00213E",
        },
        charcoal: {
          DEFAULT: "#1A1A2E", // Charcoal
          50: "#F2F2F4",
          100: "#E5E5E9",
          200: "#CBCBD3",
          300: "#B1B1BD",
          400: "#9797A7",
          500: "#1A1A2E", // Main
          600: "#171729",
          700: "#141424",
          800: "#11111F",
          900: "#0E0E1A",
        },
        gold: {
          DEFAULT: "#B8860B", // Dark Gold
          50: "#FDF8E8",
          100: "#FBF1D1",
          200: "#F7E3A3",
          300: "#F3D575",
          400: "#EFC747",
          500: "#B8860B", // Main
          600: "#A6780A",
          700: "#946A09",
          800: "#825C08",
          900: "#704E07",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
