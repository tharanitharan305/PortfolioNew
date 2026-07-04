import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        "bg-deep": "#12141c",
        surface: "#f3ede0",
        accent: "#d4a24c",
        "accent-teal": "#4fa39c",
        "text-body": "#e8e4d8",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(212,162,76,0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(212,162,76,0.4)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "aurora": {
          "0%": { transform: "translateX(-100%) translateY(0) rotate(0deg)", opacity: "0.3" },
          "50%": { transform: "translateX(0%) translateY(-20%) rotate(3deg)", opacity: "0.5" },
          "100%": { transform: "translateX(100%) translateY(0) rotate(0deg)", opacity: "0.3" },
        },
      },
      animation: {
        sway: "sway 3s ease-in-out infinite",
        blink: "blink 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "gradient-shift": "gradient-shift 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "aurora": "aurora 8s ease-in-out infinite",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        "glass-border":
          "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
      },
    },
  },
  plugins: [],
};
export default config;
