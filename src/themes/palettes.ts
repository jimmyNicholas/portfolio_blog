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
    backgroundAlt: "#3d2b79", // Lighter purple background
    textMuted: "#b8a8d8", // Muted purple text
    success: "#8fbc8f", // Sage green
    border: "#5e4d89", // Medium purple border
  },
  businessLight: {
    // name: "Business Light",
    // primary: "#6B6BAE",
    // secondary: "#333333",
    // accent: "#6B6BAE",
    // background: "#ffffff",
    // text: "#1a1a1a",
    name: "Bold Executive Light",
    primary: "#8B5CF6",        // Vivid purple
    secondary: "#14B8A6",      // Vivid teal
    accent: "#A78BFA",         // Medium purple
    background: "#FFFFFF",     // Pure white
    backgroundAlt: "#F3F4F6",  // Light grey
    text: "#111827",          // Deep slate text
    textMuted: "#6B7280",     // Medium grey
    success: "#10B981",        // Vivid green
    border: "#E5E7EB",        // Light grey border
  },
  businessDark: {
    // name: "Business Dark",
    // primary: "#6B6BAE",
    // secondary: "#e0e0e0",
    // accent: "#6B6BAE",
    // background: "#1a1a1a",
    // text: "#f0f0f0",
    name: "Bold Executive Dark",
    primary: "#A78BFA",        // Bright purple
    secondary: "#5EEAD4",      // Bright teal
    accent: "#C4B5FD",         // Light purple
    background: "#111827",     // Deep slate
    backgroundAlt: "#1F2937",  // Medium slate
    text: "#F9FAFB",          // Almost white
    textMuted: "#9CA3AF",     // Cool grey
    success: "#34D399",        // Bright teal-green
    border: "#374151",        // Slate border
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