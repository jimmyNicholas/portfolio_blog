"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffects } from "@/app/styleEffects/useEffects";

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
    injectGlobalStyles,
  } = useEffects({
    filmGrain: true,
    grainIntensity: 0.08,
    crtScanlines: true,
    scanlineIntensity: 0.15,
    effectsOpacity: 0.7,
  });

  useEffect(() => {
    injectKeyframes();
    injectGlobalStyles();

    // Add mode classes to body
    const body = document.body;
    body.classList.toggle("business-mode", isBusinessMode);
    body.classList.toggle("business-dark", isBusinessMode && isDarkMode);
    body.classList.toggle("business-light", isBusinessMode && !isDarkMode);
  }, [injectKeyframes, injectGlobalStyles, isBusinessMode, isDarkMode]);

  const handleNavigation = (
    page: "work" | "about" | "thoughts" | "archive"
  ) => {
    router.push(`/${page}`);
  };

  const baseFilter = getBaseFilterStyle();
  const isHomePage = pathname === "/";

  // Get button styles based on state
  const getButtonStyle = (path: string) => {
    const isSelected = pathname === path;
    const isHovered = hoveredButton === path;

    if (isBusinessMode) {
      if (isDarkMode) {
        return {
          backgroundColor: isSelected
            ? "#333333"
            : isHovered
            ? "#404040"
            : "#1a1a1a",
          color: isSelected ? "#ffffff" : isHovered ? "#ffffff" : "#ffffff",
          borderColor: "#cccccc",
          boxShadow: isSelected
            ? "inset 0 2px 4px rgba(255,255,255,0.1)"
            : "none",
        };
      } else {
        return {
          backgroundColor: isSelected
            ? "#f0f0f0"
            : isHovered
            ? "#f5f5f5"
            : "#ffffff",
          color: "#000000",
          borderColor: "#000000",
          boxShadow: isSelected ? "inset 0 2px 4px rgba(0,0,0,0.1)" : "none",
        };
      }
    }

    return {
      backgroundColor: isSelected
        ? palette.primary
        : isHovered
        ? palette.secondary
        : palette.background,
      color: isSelected
        ? palette.background
        : isHovered
        ? palette.background
        : palette.text,
      borderColor: palette.text,
      boxShadow: isSelected
        ? `inset 0 0 10px ${palette.accent}60, 0 0 20px ${palette.accent}40`
        : isHovered
        ? `0 0 30px ${palette.accent}80`
        : `0 0 20px ${palette.accent}40`,
      ...baseFilter,
    };
  };

  // Get toggle button styles
  const getToggleButtonStyle = (type: "dark" | "business") => {
    if (type === "dark") {
      if (isBusinessMode) {
        return isDarkMode
          ? {
              backgroundColor: "#333333",
              color: "#ffffff",
              borderColor: "#cccccc",
            }
          : {
              backgroundColor: "#fff3cd",
              color: "#856404",
              borderColor: "#ffeaa7",
            };
      } else {
        return {
          color: palette.text,
          backgroundColor: palette.background,
          borderColor: palette.accent,
          ...baseFilter,
        };
      }
    } else {
      if (isBusinessMode) {
        return isDarkMode
          ? {
              backgroundColor: "#333333",
              color: "#ffffff",
              borderColor: "#cccccc",
            }
          : {
              backgroundColor: "#e9ecef",
              color: "#495057",
              borderColor: "#ced4da",
            };
      } else {
        return {
          color: palette.text,
          backgroundColor: palette.background,
          borderColor: palette.accent,
          ...baseFilter,
        };
      }
    }
  };

  const navItems = [
    { path: "/work", label: "work" },
    { path: "/about", label: "about" },
    { path: "/thoughts", label: "thoughts" },
    { path: "/archive", label: "archive" },
  ];

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: palette.background,
        ...backgroundEffectStyles.container,
        ...baseFilter,
      }}
    >
      <div style={backgroundEffectStyles.overlay} />

      {/* Mode Toggle Buttons - Always in top right */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded-lg border-2 transition-all font-medium hover:opacity-80"
          style={getToggleButtonStyle("dark")}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>

        <button
          onClick={toggleBusinessMode}
          className="px-4 py-2 rounded-lg border-2 transition-all font-medium hover:opacity-80"
          style={getToggleButtonStyle("business")}
        >
          {isBusinessMode ? "💼 Business" : "🎨 Creative"}
        </button>
      </div>

      <div className="min-h-screen">
        <div
          className="container mx-auto px-4 py-8 relative"
          style={{ zIndex: 10 }}
        >
          <motion.div
            className={`mb-12 ${
              isHomePage
                ? "min-h-screen flex items-center justify-center"
                : "pt-14"
            }`}
            layout
            transition={{
              duration: 0.8,
              ease: [0.8, 0, 0.2, 1], 
            }}
          >
            <motion.div className="flex flex-col items-center space-y-4" layout>
              {/* Main Title Button */}
              <motion.div className="w-full max-w-2xl relative" layout>
                <div style={foregroundEffectStyles.overlay} />
                <div
                  className={`border-2 rounded-lg px-8 py-6 text-4xl font-bold w-full text-center cursor-pointer transition-all duration-300 relative ${
                    !isBusinessMode ? "crt-scanlines" : ""
                  }`}
                  onClick={() => router.push("/")}
                  onMouseEnter={() => setHoveredButton("/")}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={getButtonStyle("/")}
                >
                  Jimmy Nicholas
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              <motion.div className="flex space-x-8 w-full max-w-2xl" layout>
                {navItems.map(({ path, label }) => (
                  <motion.div key={path} className="flex-1 relative" layout>
                    <div style={foregroundEffectStyles.overlay} />
                    <div
                      className={`border-2 rounded-lg px-8 py-6 text-2xl text-center cursor-pointer transition-all duration-300 relative ${
                        !isBusinessMode ? "crt-scanlines" : ""
                      }`}
                      onClick={() =>
                        handleNavigation(
                          label as "work" | "about" | "thoughts" | "archive"
                        )
                      }
                      onMouseEnter={() => setHoveredButton(path)}
                      onMouseLeave={() => setHoveredButton(null)}
                      style={getButtonStyle(path)}
                    >
                      {label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content Window with entrance animation */}
          <AnimatePresence>
            {!isHomePage && (
              <motion.div
                className="mb-16 p-8 rounded-2xl mx-auto relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div style={foregroundEffectStyles.overlay} />
                <div
                  className={`relative ${
                    !isBusinessMode ? "crt-scanlines" : ""
                  }`}
                  style={
                    isBusinessMode
                      ? {
                          backgroundColor: palette.background,
                          border: `2px solid ${palette.accent}`,
                          color: palette.text,
                        }
                      : {
                          backgroundColor: palette.background,
                          border: `2px solid ${palette.accent}`,
                          boxShadow: `0 0 20px ${palette.accent}30`,
                          ...baseFilter,
                        }
                  }
                >
                  <div style={{ color: palette.accent }}>{children}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Layout;