export interface EffectSettings {
  // CRT/Scanline Effects
  crtScanlines: boolean;
  scanlineIntensity: number;
  scanlineSpacing: number;

  // Film Grain
  filmGrain: boolean;
  grainIntensity: number;
  grainSize: number;
  grainAnimation: boolean;

  // Chromatic Aberration
  chromaticAberration: boolean;
  rgbShiftIntensity: number;

  // Halftone
  halftone: boolean;
  halftoneSize: number;
  halftoneIntensity: number;

  // VHS Tracking
  vhsTracking: boolean;
  trackingSpeed: number;

  // Digital Glitch
  digitalGlitch: boolean;
  glitchFrequency: number;

  // Color Filters
  warmth: number;
  saturation: number;

  // Global
  effectsOpacity: number;
  isBusinessMode: boolean;
  isDarkMode: boolean;
}

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface EffectStyles {
  container: React.CSSProperties;
  overlay: React.CSSProperties;
}