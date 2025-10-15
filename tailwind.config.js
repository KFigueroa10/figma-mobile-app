
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fig: {
          ink: "#0B0B16",
          night: "#0E0B3A",
          violet: "#563BFF",
          purple: "#3B2F8F",
          blue: "#1B63E1",
          sky: "#5FB1D6",
        }
      },
      borderRadius: { pill: "9999px" },
      backgroundImage: {
        "welcome-wave": "linear-gradient(180deg, #0E0B3A 0%, #1B63E1 100%)",
        "chat-gradient": "linear-gradient(180deg, #0E0B3A 0%, #140F4B 60%, #0B0B16 100%)"
      },
      keyframes: {
        plane: {
          "0%": { transform: "translateX(-20%) translateY(0) rotate(-8deg)" },
          "50%": { transform: "translateX(50vw) translateY(-6px) rotate(2deg)" },
          "100%": { transform: "translateX(105%) translateY(0) rotate(-6deg)" }
        },
        progress: { "0%": { width: "4%" }, "50%": { width: "72%" }, "100%": { width: "96%" } }
      },
      animation: { plane: "plane 2.2s ease-in-out infinite", progress: "progress 2.2s ease-in-out infinite" }
    }
  },
  plugins: []
}
