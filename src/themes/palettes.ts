import { ColorPalette } from "./types";

export type ThemeMode = "dark" | "light";
export type StyleMode = "business" | "creative";

export const palettes = {
  periwinkleOrchid: {
    name: "Periwinkle Orchid",
    primary: "#da70d6", // Purple 
    secondary: "#9e0f69", // Darker Purple
    accent: "#ccccff", // Light Purple
    background: "#2d1b69", // Dark Purple
    text: "#da70d6", // Purple
  },
  businessLight: {
    name: "Business Light",
    primary: "#000000",
    secondary: "#333333",
    accent: "#666666",
    background: "#ffffff",
    text: "#000000",
  },
  businessDark: {
    name: "Business Dark",
    primary: "#ffffff",
    secondary: "#e0e0e0",
    accent: "#e0e0e0",
    background: "#1a1a1a",
    text: "#ffffff",
  },
};

export function getPalette(themeMode: ThemeMode, styleMode: StyleMode): ColorPalette {
  if (styleMode === "business") {
    return themeMode === "dark" ? palettes.businessDark : palettes.businessLight;
  }
  // For creative mode, always use the same palette - day/night is handled by saturation/warmth filters
  return palettes.periwinkleOrchid;
}

export function getEffectsEnabled(styleMode: StyleMode): boolean {
  return styleMode === "creative";
} 