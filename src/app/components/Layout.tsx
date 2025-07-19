"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffects } from "../styleEffects/useEffects";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  const {
    palette,
    isBusinessMode,
    isDarkMode,
    toggleDarkMode,
    toggleBusinessMode,
    getBaseFilterStyle,
    backgroundEffectStyles,
    foregroundEffectStyles,
    injectKeyframes,
    injectGlobalStyles
  } = useEffects({
    filmGrain: true,
    grainIntensity: 0.08,
    crtScanlines: true,
    scanlineIntensity: 0.15,
    effectsOpacity: 0.7
  });

  useEffect(() => {
    injectKeyframes();
    injectGlobalStyles();
    
    // Add mode classes to body
    const body = document.body;
    body.classList.toggle('business-mode', isBusinessMode);
    body.classList.toggle('business-dark', isBusinessMode && isDarkMode);
    body.classList.toggle('business-light', isBusinessMode && !isDarkMode);
  }, [injectKeyframes, injectGlobalStyles, isBusinessMode, isDarkMode]);

  const handleNavigation = (page: "music" | "teaching" | "code") => {
    router.push(`/${page}`);
  };

  const baseFilter = getBaseFilterStyle();

  // Get button styles based on state
  const getButtonStyle = (path: string) => {
    const isSelected = pathname === path;
    const isHovered = hoveredButton === path;
    
    if (isBusinessMode) {
      if (isDarkMode) {
        // Business Dark Mode
        return {
          backgroundColor: isSelected ? "#333333" : isHovered ? "#404040" : "#1a1a1a",
          color: isSelected ? "#ffffff" : isHovered ? "#ffffff" : "#ffffff",
          borderColor: "#cccccc",
          boxShadow: isSelected ? "inset 0 2px 4px rgba(255,255,255,0.1)" : "none"
        };
      } else {
        // Business Light Mode
        return {
          backgroundColor: isSelected ? "#f0f0f0" : isHovered ? "#f5f5f5" : "#ffffff",
          color: "#000000",
          borderColor: "#000000",
          boxShadow: isSelected ? "inset 0 2px 4px rgba(0,0,0,0.1)" : "none"
        };
      }
    }
    
    // Creative Mode (unchanged)
    return {
      backgroundColor: isSelected ? palette.primary : isHovered ? palette.secondary : palette.background,
      color: isSelected ? palette.background : isHovered ? palette.background : palette.text,
      borderColor: palette.text,
      boxShadow: isSelected 
        ? `inset 0 0 10px ${palette.accent}60, 0 0 20px ${palette.accent}40`
        : isHovered 
          ? `0 0 30px ${palette.accent}80`
          : `0 0 20px ${palette.accent}40`,
      ...baseFilter
    };
  };

  // Get toggle button styles
  const getToggleButtonStyle = (type: 'dark' | 'business') => {
    if (type === 'dark') {
      if (isBusinessMode) {
        // Dark/Light toggle in business mode
        return isDarkMode ? {
          backgroundColor: "#333333",
          color: "#ffffff",
          borderColor: "#cccccc"
        } : {
          backgroundColor: "#fff3cd",
          color: "#856404",
          borderColor: "#ffeaa7"
        };
      } else {
        // Dark/Light toggle in creative mode
        return {
          color: palette.text,
          backgroundColor: palette.background,
          borderColor: palette.accent,
          ...baseFilter
        };
      }
    } else {
      // Business toggle
      if (isBusinessMode) {
        return isDarkMode ? {
          backgroundColor: "#333333",
          color: "#ffffff",
          borderColor: "#cccccc"
        } : {
          backgroundColor: "#e9ecef",
          color: "#495057",
          borderColor: "#ced4da"
        };
      } else {
        return {
          color: palette.text,
          backgroundColor: palette.background,
          borderColor: palette.accent,
          ...baseFilter
        };
      }
    }
  };

  const navItems = [
    { path: "/music", label: "music" },
    { path: "/teaching", label: "teaching" },
    { path: "/code", label: "code" }
  ];

  return (
    <div 
      className="h-full py-8 relative"
      style={{
        backgroundColor: palette.background,
        ...backgroundEffectStyles.container,
        ...baseFilter
      }}
    >
      {/* Background effects overlay */}
      <div style={backgroundEffectStyles.overlay} />
      
      <div
        className="container mx-auto px-4 py-8 relative"
        style={{ zIndex: 10 }}
      >
        {/* Mode Toggle Buttons */}
        <div className="fixed top-4 right-4 flex gap-2 z-50">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg border-2 transition-all font-medium hover:opacity-80"
            style={getToggleButtonStyle('dark')}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
          
          <button
            onClick={toggleBusinessMode}
            className="px-4 py-2 rounded-lg border-2 transition-all font-medium hover:opacity-80"
            style={getToggleButtonStyle('business')}
          >
            {isBusinessMode ? "💼 Business" : "🎨 Creative"}
          </button>
        </div>

        <div className="mb-12">
          <div className="flex flex-col items-center space-y-4">
            {/* Main Title Button */}
            <div className="w-full max-w-md relative">
              <div style={foregroundEffectStyles.overlay} />
              <div
                className={`border-2 rounded-lg px-6 py-4 text-2xl font-bold w-full text-center cursor-pointer transition-all duration-300 relative ${
                  !isBusinessMode ? "crt-scanlines" : ""
                }`}
                onClick={() => router.push("/")}
                onMouseEnter={() => setHoveredButton("/")}
                onMouseLeave={() => setHoveredButton(null)}
                style={getButtonStyle("/")}
              >
                Jimmy Nicholas
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex space-x-4 w-full max-w-md">
              {navItems.map(({ path, label }) => (
                <div key={path} className="flex-1 relative">
                  <div style={foregroundEffectStyles.overlay} />
                  <div
                    className={`border-2 rounded-lg px-6 py-4 text-lg text-center cursor-pointer transition-all duration-300 relative ${
                      !isBusinessMode ? "crt-scanlines" : ""
                    }`}
                    onClick={() => handleNavigation(label as "music" | "teaching" | "code")}
                    onMouseEnter={() => setHoveredButton(path)}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={getButtonStyle(path)}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content Window */}
        <div className="mb-16 p-8 rounded-2xl max-w-[70%] mx-auto relative">
          <div style={foregroundEffectStyles.overlay} />
          <div 
            className={`relative ${!isBusinessMode ? "crt-scanlines" : ""}`}
            style={isBusinessMode ? {
              backgroundColor: palette.background,
              border: `2px solid ${palette.accent}`,
              color: palette.text
            } : {
              backgroundColor: palette.background,
              border: `2px solid ${palette.accent}`,
              boxShadow: `0 0 20px ${palette.accent}30`,
              ...baseFilter
            }}
          >
            <div style={{ color: palette.accent }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;