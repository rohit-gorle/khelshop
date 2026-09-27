import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--ink)",
        volt: "#D4FF3F",
      },
      borderRadius: { xl: "1rem" },
    },
  },
  plugins: [],
} satisfies Config;
