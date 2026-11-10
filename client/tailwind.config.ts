import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-[#4096ff]",
    "bg-[#5f8de6]",
    "bg-[#7e84cc]",
    "bg-[#9d7bb3]",
    "bg-[#bc7299]",
    "bg-[#db697f]",
    "bg-[#ff4d4f]",
    "border-[#4096ff]",
    "border-[#5f8de6]",
    "border-[#7e84cc]",
    "border-[#9d7bb3]",
    "border-[#bc7299]",
    "border-[#db697f]",
    "border-[#ff4d4f]",
  ],
  // Skip hover styles on touch screens, where they stick after a tap
  future: { hoverOnlyWhenSupported: true },
  theme: {
    // Replaces Tailwind's defaults: unprefixed classes are the phone design
    screens: {
      tablet: "768px",
      desktop: "1280px",
    },
    extend: {
      colors: {
        // App colors
        redCorner: "var(--redCorner)",
        blueCorner: "var(--blueCorner)",
        redCornerDark: "var(--redCornerDark)",
        blueCornerDark: "var(--blueCornerDark)",
        standup: "var(--standup)",
        grappling: "var(--grappling)",
        health: "var(--health)",
        // Background colors
        navBg: "var(--navBg)",
        navBgElevated: "var(--navBgElevated)",
        mainBg: "var(--mainBg)",
        mainBgElevated: "var(--mainBgElevated)",
        // Dark font colors
        titleDarkFontColor: "var(--titleDarkFontColor)",
        primaryDarkFontColor: "var(--primaryDarkFontColor)",
        secondaryDarkFontColor: "var(--secondaryDarkFontColor)",
        tertiaryDarkFontColor: "var(--tertiaryDarkFontColor)",
        borderDarkFontColor: "var(--borderDarkFontColor)",
        // Light font colors
        titleLightFontColor: "var(--titleLightFontColor)",
        primaryLightFontColor: "var(--primaryLightFontColor)",
        borderLightFontColor: "var(--borderLightFontColor)",
      },
      fontSize: {
        titleFontSize: "var(--titleFontSize)",
        primaryFontSize: "var(--primaryFontSize)",
        secondaryFontSize: "var(--secondaryFontSize)",
        tertiaryFontSize: "var(--tertiaryFontSize)",
        quaternaryFontSize: "var(--quaternaryFontSize)",
      },
      boxShadow: {
        // <offset-x>, <offset-y>, <blur-radius>, <spread-radius>
        cardInset:
          "inset 0px 10px 25px -10px rgba(0,0,0,0.3), inset 0px -10px 25px -10px rgba(0,0,0,0.3)",
        weightClass: "0 0 20px 1px rgba(0,0,0,0.5)",
        verseBarHeader: "0px -10px 30px 20px rgba(0, 0, 0, 0.3)",
        verseBarFighter:
          "0 0 20px 1px rgba(0,0,0,0.5), inset 0px -20px 30px -10px rgba(0, 0, 0, 0.3)",
        verseBarInset: "inset 0px -20px 30px -10px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        // `both` keeps it hidden during the delay
        delayedFadeIn: "fadeIn 200ms ease-in 300ms both",
      },
    },
  },
  plugins: [],
};
export default config;
