import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Custom color palette
        tyrian: {
          DEFAULT: '#64113f',
          100: '#14030d',
          200: '#280719',
          300: '#3c0a26',
          400: '#500e32',
          500: '#64113f',
          600: '#a71c69',
          700: '#dd3692',
          800: '#e879b6',
          900: '#f4bcdb'
        },
        blush: {
          DEFAULT: '#de4d86',
          100: '#33091a',
          200: '#661334',
          300: '#991c4e',
          400: '#cb2568',
          500: '#de4d86',
          600: '#e572a0',
          700: '#ec95b8',
          800: '#f2b8cf',
          900: '#f9dce7'
        },
        salmon: {
          DEFAULT: '#f29ca3',
          100: '#46090e',
          200: '#8d121d',
          300: '#d31b2b',
          400: '#e95562',
          500: '#f29ca3',
          600: '#f5b0b6',
          700: '#f7c3c8',
          800: '#fad7da',
          900: '#fcebed'
        },
        tearose: {
          DEFAULT: '#f7cacd',
          100: '#4a1115',
          200: '#94222a',
          300: '#de333e',
          400: '#ea7c86',
          500: '#f7cacd',
          600: '#f9d5d7',
          700: '#fae0e1',
          800: '#fcebeb',
          900: '#fdf5f5'
        },
        sky: {
          DEFAULT: '#84e6f8',
          100: '#0d3741',
          200: '#1a6e82',
          300: '#27a5c3',
          400: '#53d1ec',
          500: '#84e6f8',
          600: '#9debf9',
          700: '#b5f0fa',
          800: '#cef5fc',
          900: '#e6fafd'
        },
        // Game-specific aliases
        success: '#84e6f8',
        warning: '#f29ca3',
        // Shadcn UI colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
