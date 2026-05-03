/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/**/*.html", "src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Apple Design System tokens – LIGHT THEME ONLY ──────────────────────────
        primary: {
          DEFAULT: "#0066cc",
          focus: "#0071e3",
        },
        ink: {
          DEFAULT: "#1d1d1f",
          secondary: "#6e6e73",
          disabled: "#a1a1a6",
          "muted-80": "#333333",
          "muted-48": "#7a7a7a",
        },
        canvas: {
          DEFAULT: "#ffffff",
          parchment: "#f5f5f7",
        },
        surface: {
          pearl: "#fafafc",
          DEFAULT: "#ffffff",
          secondary: "#fafafc",
        },
        hairline: "#e0e0e0",
        divider: {
          soft: "#f0f0f0",
        },
        "body-muted": "#6e6e73",
        "on-primary": "#ffffff",

        // ── Legacy aliases (prevents breakage) ──────────────────
        text: {
          primary: "#1d1d1f",
          secondary: "#6e6e73",
          muted: "#6e6e73",
        },
        border: "#e0e0e0",
        "bg-soft": "#f5f5f7",
        "bg-page": "#f5f5f7",
        success: "#1d6b1d",
      },
      fontFamily: {
        display: ['"SF Pro Display"', "system-ui", "-apple-system", "sans-serif"],
        body: ['"SF Pro Text"', "system-ui", "-apple-system", "sans-serif"],
        text: ['"SF Pro Text"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "11px",
        lg: "18px",
        pill: "9999px",
      },
      spacing: {
        section: "80px",
      },
      boxShadow: {
        product: "rgba(0, 0, 0, 0.22) 3px 5px 30px",
        none: "none",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};