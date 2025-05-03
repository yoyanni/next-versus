import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // App colors
        redCorner: "var(--redCorner)",
        blueCorner: "var(--blueCorner)",
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
          "inset 0px 20px 15px -10px rgba(0,0,0,0.3), inset 0px -20px 15px -10px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
