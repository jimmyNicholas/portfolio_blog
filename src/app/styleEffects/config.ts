import { EffectSettings } from "./types";

export const defaultSettings: EffectSettings = {
  crtScanlines: false,
  scanlineIntensity: 0.25,
  scanlineSpacing: 2,
  filmGrain: false,
  grainIntensity: 0.15,
  grainSize: 3,
  grainAnimation: true,
  chromaticAberration: false,
  rgbShiftIntensity: 2,
  halftone: false,
  halftoneSize: 8,
  halftoneIntensity: 0.3,
  vhsTracking: false,
  trackingSpeed: 3,
  digitalGlitch: false,
  glitchFrequency: 4,
  warmth: 0.4,
  saturation: 1.2,
  effectsOpacity: 1.0,
  isBusinessMode: false,
  isDarkMode: true,
};

export const palettes = {
  periwinkleOrchid: {
    name: "Periwinkle Orchid",
    primary: "#da70d6",
    secondary: "#ff8c42",
    accent: "#ccccff",
    background: "#2d1b69",
    text: "#da70d6",
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