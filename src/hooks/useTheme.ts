import { useState, useMemo, useEffect } from "react";
import { EffectStyles } from "../themes/types";
import { ThemeMode, StyleMode, getPalette, getEffectsEnabled } from "../themes/palettes";
import { createFractalNoise, createSVGFilter } from "../themes/helpers";

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [styleMode, setStyleMode] = useState<StyleMode>("creative");

  const palette = useMemo(() => getPalette(themeMode, styleMode), [themeMode, styleMode]);
  const effectsEnabled = useMemo(() => getEffectsEnabled(styleMode), [styleMode]);

  // Update CSS custom properties and data attributes
  useEffect(() => {
    const root = document.documentElement;
    
    // Set data attributes for CSS selectors
    root.setAttribute('data-theme', themeMode);
    root.setAttribute('data-style', styleMode);
    
    // Set CSS custom properties
    root.style.setProperty('--palette-primary', palette.primary);
    root.style.setProperty('--palette-secondary', palette.secondary);
    root.style.setProperty('--palette-accent', palette.accent);
    root.style.setProperty('--palette-background', palette.background);
    root.style.setProperty('--palette-text', palette.text);
    
    // Set effect properties
    root.style.setProperty('--effects-enabled', effectsEnabled ? '1' : '0');
    root.style.setProperty('--scanline-speed', '2.0s'); // Configurable scanline speed
    
    // Set saturation and warmth for creative mode day/night
    if (styleMode === 'creative') {
      const saturation = themeMode === 'dark' ? 1.1 : 2.4;
      const warmth = 0.3; // Keep consistent warmth
      root.style.setProperty('--effect-saturation', saturation.toString());
      root.style.setProperty('--effect-warmth', warmth.toString());
    } else {
      // Business mode - no filters
      root.style.setProperty('--effect-saturation', '1.0');
      root.style.setProperty('--effect-warmth', '0');
    }
  }, [themeMode, styleMode, palette, effectsEnabled]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === "dark" ? "light" : "dark");
  };

  const toggleStyle = () => {
    setStyleMode(prev => prev === "creative" ? "business" : "creative");
  };

  // Generate effect styles only when effects are enabled
  const effectStyles = useMemo((): EffectStyles => {
    if (!effectsEnabled) {
      return { container: {}, overlay: { display: "none" } };
    }

    const subtleNoise = createSVGFilter('noiseFilter', createFractalNoise(3), 0.08);

    return {
      container: { position: "relative" },
      overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none",
        opacity: 1.0, 
        backgroundImage: subtleNoise,
        mixBlendMode: "overlay",
      }
    };
  }, [effectsEnabled]);

  return {
    // State
    themeMode,
    styleMode,
    
    // Actions
    toggleTheme,
    toggleStyle,
    
    // Computed values
    palette,
    effectsEnabled,
    effectStyles,
    
    // Convenience booleans for components
    isDarkMode: themeMode === "dark",
    isBusinessMode: styleMode === "business",
  };
} 