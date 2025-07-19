import { useState, useMemo } from "react";
import { EffectSettings, ColorPalette, EffectStyles } from './types';
import { defaultSettings, palettes } from './config';
import { createFractalNoise, createRadialDot, createSVGFilter, createTurbulenceNoise,  } from "./helpers";
import { CHROME_ABERRATION_COLORS, HALFTONE_COLORS, LARGE_VIEWBOX } from "./consts";

// === PRESET CONFIGURATIONS ===
const createPresets = () => ({
  clean: defaultSettings,
  
  subtle: {
    ...defaultSettings,
    filmGrain: true,
    grainIntensity: 0.08,
    crtScanlines: true,
    scanlineIntensity: 0.15,
    effectsOpacity: 0.7,
  },
  
  damaged: {
    ...defaultSettings,
    filmGrain: true,
    grainIntensity: 1.0,
    grainSize: 0.5,
    grainAnimation: true,
    chromaticAberration: true,
    rgbShiftIntensity: 36,
    halftone: true,
    halftoneSize: 18,
    halftoneIntensity: 0.9,
    crtScanlines: true,
    scanlineIntensity: 0.7,
    scanlineSpacing: 9,
    vhsTracking: true,
    trackingSpeed: 1.5,
    digitalGlitch: true,
    glitchFrequency: 15,
    effectsOpacity: 1.0,
    warmth: 0.9,
    saturation: 2.2,
  },
  
  business: {
    ...defaultSettings,
    isBusinessMode: true,
    warmth: 0,
    saturation: 1.0,
    effectsOpacity: 0,
  },
});

// === MAIN HOOK ===
export const useEffects = (initialSettings?: Partial<EffectSettings>) => {
  const [settings, setSettings] = useState<EffectSettings>({
    ...defaultSettings,
    ...initialSettings,
  });

  const presets = createPresets();

  // === STATE MANAGEMENT ===
  const updateSetting = <K extends keyof EffectSettings>(key: K, value: EffectSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getCurrentPalette = (): ColorPalette => {
    if (settings.isBusinessMode) {
      return settings.isDarkMode ? palettes.businessDark : palettes.businessLight;
    }
    return palettes.periwinkleOrchid;
  };

  const getCurrentSaturation = () => {
    if (settings.isBusinessMode) return 1.0;
    return settings.isDarkMode ? 1.2 : 2.0;
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    setSettings(prev => ({
      ...presets[presetName],
      isDarkMode: prev.isDarkMode,
    }));
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
      saturation: prev.isBusinessMode ? 1.0 : (!prev.isDarkMode ? 1.2 : 2.0),
    }));
  };

  const toggleBusinessMode = () => {
    if (settings.isBusinessMode) {
      setSettings(prev => ({
        ...presets.subtle,
        isDarkMode: prev.isDarkMode,
        isBusinessMode: false,
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        ...presets.business,
        isDarkMode: prev.isDarkMode,
      }));
    }
  };

  const getBaseFilterStyle = () => {
    if (settings.isBusinessMode) return { filter: "none" };
    
    const currentSaturation = getCurrentSaturation();
    return { filter: `sepia(${settings.warmth}) saturate(${currentSaturation})` };
  };

  // === EFFECT STYLES ===
  const backgroundEffectStyles = useMemo((): EffectStyles => {
    if (settings.isBusinessMode) {
      return { container: {}, overlay: { display: "none" } };
    }

    const container: React.CSSProperties = { position: "relative" };
    const overlay: React.CSSProperties = {
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: "none",
      opacity: settings.effectsOpacity,
    };

    // Apply chromatic aberration - compute inline
    if (settings.chromaticAberration) {
      const { rgbShiftIntensity } = settings;
      container.filter = [
        `drop-shadow(${rgbShiftIntensity}px 0 0 ${CHROME_ABERRATION_COLORS.red})`,
        `drop-shadow(-${rgbShiftIntensity}px 0 0 ${CHROME_ABERRATION_COLORS.cyan})`,
        `drop-shadow(0 ${rgbShiftIntensity / 2}px 0 ${CHROME_ABERRATION_COLORS.green})`
      ].join(" ");
    }

    // Build background images
    const backgroundImages: string[] = [];
    
    if (settings.filmGrain) {
      // Large grain pattern
      const largeGrain = createSVGFilter('largeNoise', createFractalNoise(settings.grainSize, 3), settings.grainIntensity);
      backgroundImages.push(largeGrain);
      
      // Coarse texture
      const coarseTexture = createSVGFilter('coarseNoise', createTurbulenceNoise(3), 0.4, LARGE_VIEWBOX);
      backgroundImages.push(coarseTexture);
    }

    if (settings.halftone) {
      const { halftoneSize: size, halftoneIntensity: intensity } = settings;
      
      // Create halftone patterns inline
      const halftonePatterns = [
        createRadialDot(25, 25, HALFTONE_COLORS.white, intensity, size / 2),
        createRadialDot(75, 75, HALFTONE_COLORS.black, intensity * 0.8, size / 3),
        createRadialDot(50, 0, HALFTONE_COLORS.magenta, intensity * 0.4, size / 4),
        createRadialDot(0, 50, HALFTONE_COLORS.cyan, intensity * 0.3, size / 5)
      ];
      
      backgroundImages.push(...halftonePatterns);
      
      // Set background sizes
      overlay.backgroundSize = [
        `${size}px ${size}px`,
        `${size * 0.8}px ${size * 0.8}px`,
        `${size * 1.5}px ${size * 1.5}px`,
        `${size * 2}px ${size * 2}px`,
      ].join(", ");
    }

    if (backgroundImages.length > 0) {
      overlay.backgroundImage = backgroundImages.join(", ");
      overlay.mixBlendMode = settings.halftone ? "hard-light" : "overlay";
    }

    return { container, overlay };
  }, [settings]);

  const foregroundEffectStyles = useMemo((): EffectStyles => {
    if (settings.isBusinessMode) {
      return { container: {}, overlay: { display: "none" } };
    }

    const subtleNoise = createSVGFilter('noiseFilter', createFractalNoise(3), 0.08);

    return {
      container: { position: "relative" },
      overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none",
        opacity: 0.7,
        backgroundImage: subtleNoise,
        mixBlendMode: "overlay",
      }
    };
  }, [settings.isBusinessMode]);

  // === KEYFRAME INJECTION ===
  const injectKeyframes = () => {
    const { rgbShiftIntensity, scanlineIntensity, scanlineSpacing, glitchFrequency, isBusinessMode, effectsOpacity } = settings;

    const keyframes = `
      @keyframes vhs-tracking {
        0% { transform: translateY(-100%) skewX(2deg); opacity: 0; }
        2% { opacity: 0.9; } 4% { opacity: 0.3; } 6% { opacity: 0.8; }
        96% { opacity: 0.8; } 98% { opacity: 0.2; }
        100% { transform: translateY(calc(100vh + 100%)) skewX(-1deg); opacity: 0; }
      }
      
      @keyframes film-grain-move {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(-6px, 6px) rotate(0.8deg); }
        50% { transform: translate(6px, -6px) rotate(-0.8deg); }
        75% { transform: translate(-6px, -6px) rotate(0.5deg); }
      }
      
      @keyframes digital-glitch {
        0%, 80%, 100% { transform: translate(0); filter: hue-rotate(0deg) contrast(1) brightness(1); }
        3%, 8% { transform: translateX(${rgbShiftIntensity / 2}px); filter: hue-rotate(90deg) contrast(1.4) brightness(1.2); }
        12%, 18% { transform: translateX(-${rgbShiftIntensity / 2}px) translateY(3px); filter: hue-rotate(-90deg) contrast(0.6) brightness(0.8); }
        22%, 28% { transform: translateY(-${rgbShiftIntensity / 4}px); filter: hue-rotate(180deg) contrast(1.8) brightness(1.1); }
      }
      
      .crt-scanlines::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: 
          linear-gradient(transparent 50%, rgba(0, 0, 0, ${scanlineIntensity}) 50%),
          linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, ${scanlineIntensity * 0.3}) 50%);
        background-size: 100% ${scanlineSpacing}px, ${scanlineSpacing * 3}px 100%;
        pointer-events: none;
        z-index: 10;
        opacity: ${isBusinessMode ? 0 : effectsOpacity};
      }
      
      .film-grain-animated { animation: film-grain-move 2s infinite; }
      .digital-glitch-animated { animation: digital-glitch ${Math.max(2, 60 / glitchFrequency)}s infinite; }
    `;
    
    const existingStyles = document.getElementById("effects-keyframes");
    if (existingStyles) {
      existingStyles.innerHTML = keyframes;
    } else {
      const styleSheet = document.createElement("style");
      styleSheet.id = "effects-keyframes";
      styleSheet.innerHTML = keyframes;
      document.head.appendChild(styleSheet);
    }
  };

  const injectGlobalStyles = () => {
    const currentPalette = getCurrentPalette();
    const currentSaturation = getCurrentSaturation();

    const cssVariables = `
      :root {
        --palette-primary: ${currentPalette.primary};
        --palette-secondary: ${currentPalette.secondary};
        --palette-accent: ${currentPalette.accent};
        --palette-background: ${currentPalette.background};
        --palette-text: ${currentPalette.text};
        --effect-warmth: ${settings.warmth};
        --effect-saturation: ${currentSaturation};
        --effect-opacity: ${settings.effectsOpacity};
        --is-business-mode: ${settings.isBusinessMode ? 1 : 0};
        --is-dark-mode: ${settings.isDarkMode ? 1 : 0};
      }
    `;

    const existingVars = document.getElementById("global-css-variables");
    if (existingVars) {
      existingVars.innerHTML = cssVariables;
    } else {
      const styleSheet = document.createElement("style");
      styleSheet.id = "global-css-variables";
      styleSheet.innerHTML = cssVariables;
      document.head.appendChild(styleSheet);
    }
  };

  // === PUBLIC API ===
  return {
    settings,
    updateSetting,
    presets,
    applyPreset,
    toggleDarkMode,
    toggleBusinessMode,
    getCurrentPalette,
    getBaseFilterStyle,
    backgroundEffectStyles,
    foregroundEffectStyles,
    injectKeyframes,
    injectGlobalStyles,
    palette: getCurrentPalette(),
    isBusinessMode: settings.isBusinessMode,
    isDarkMode: settings.isDarkMode,
  };
};

export default useEffects;