'use client';

import { useEffect } from 'react';
import { useThemeContext } from './ThemeProvider';

export function DynamicFavicon() {
  const { themeMode, styleMode } = useThemeContext();

  useEffect(() => {
    const updateFavicon = () => {
      // Get the current palette based on theme
      const getPalette = (themeMode: string, styleMode: string) => {
        if (styleMode === "business") {
          return themeMode === "dark" 
            ? { primary: "#ffffff", background: "#1a1a1a" }
            : { primary: "#000000", background: "#ffffff" };
        }
        // For creative mode, adjust colors based on light/dark
        if (themeMode === "dark") {
          return { primary: "#da70d6", background: "#2d1b69" }; // Dark creative - light text on dark background
        } else {
          return { primary: "#2d1b69", background: "#da70d6" }; // Light creative - dark text on light background
        }
      };

      const palette = getPalette(themeMode, styleMode);
      
      // Create SVG favicon
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
          <rect width="32" height="32" fill="${palette.background}"/>
          <text 
            x="16" 
            y="24" 
            font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
            font-size="20" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="${palette.primary}"
            style="user-select: none;"
          >
            JN
          </text>
        </svg>
      `;

      // Convert SVG to data URL
      const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
      
      // Update favicon
      const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (link) {
        link.href = dataUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = dataUrl;
        document.head.appendChild(newLink);
      }
    };

    updateFavicon();
  }, [themeMode, styleMode]);

  return null; // This component doesn't render anything
} 