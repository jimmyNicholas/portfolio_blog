"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { EffectStyles } from "@/themes/types";

interface NavigationProps {
  isBusinessMode: boolean;
  isDarkMode: boolean;
  foregroundEffectStyles: EffectStyles;
  isHomePage: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  isBusinessMode,
  isDarkMode,
  foregroundEffectStyles,
  isHomePage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleNavigation = (
    page: "work" | "about" | "thoughts" | "archive"
  ) => {
    router.push(`/${page}`);
  };

  // Get button styles based on state and type
  const getButtonStyle = (path: string, type: "title" | "nav" = "nav") => {
    const isSelected = pathname === path;
    const isHovered = hoveredButton === path;
    const isTitle = type === "title";

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

    // Use CSS custom properties for creative mode
    return {
      backgroundColor: isSelected
        ? "var(--palette-primary)"
        : isHovered
        ? "color-mix(in srgb, var(--palette-primary) 60%, var(--palette-background) 40%)"
        : "var(--palette-background)",
      color: isSelected
        ? "var(--palette-background)"
        : isHovered
        ? "var(--palette-background)"
        : "var(--palette-text)",
      borderColor: "var(--palette-secondary)",
      boxShadow: isSelected
        ? isTitle
          ? "inset 0 0 15px color-mix(in srgb, var(--palette-accent) 70%, transparent), 0 0 30px color-mix(in srgb, var(--palette-accent) 50%, transparent)"
          : "inset 0 0 10px color-mix(in srgb, var(--palette-accent) 60%, transparent), 0 0 20px color-mix(in srgb, var(--palette-accent) 40%, transparent)"
        : isHovered
        ? isTitle
          ? "0 0 40px color-mix(in srgb, var(--palette-accent) 90%, transparent)"
          : "0 0 30px color-mix(in srgb, var(--palette-accent) 80%, transparent)"
        : isTitle
        ? "0 0 30px color-mix(in srgb, var(--palette-accent) 50%, transparent)"
        : "0 0 20px color-mix(in srgb, var(--palette-accent) 40%, transparent)",
    };
  };

  const navItems = [
    { path: "/work", label: "work" },
    { path: "/about", label: "about" },
  ];

  return (
    <motion.div
      className={`${
        isHomePage
          ? "min-h-screen flex items-center justify-center -mt-36"
          : "pt-14"
      }`}
      layout
      initial={{ scale: isHomePage ? 1.25 : 1 }}
      animate={{ scale: isHomePage ? 1.25 : 1 }}
      style={{
        scale: isHomePage ? 1.25 : 1,
      }}
      transition={{
        duration: 0.8,
        ease: [0.0, 0.0, 0.2, 1],
      }}
    >
      <motion.div className={`flex flex-col items-center space-y-4 ${isHomePage ? 'w-full max-w-4xl' : ''}`} layout>
        {/* Main Title Button */}
        <motion.div className={`w-full max-w-2xl relative`} layout>
          {!isBusinessMode && <div style={foregroundEffectStyles.overlay} />}
          <div
            className={`border-2 rounded-lg px-10 py-8 text-4xl font-bold w-full text-center cursor-pointer transition-all duration-300 relative ${
              !isBusinessMode ? "crt-scanlines" : ""
            }`}
            onClick={() => router.push("/")}
            onMouseEnter={() => setHoveredButton("/")}
            onMouseLeave={() => setHoveredButton(null)}
            style={getButtonStyle("/", "title")}
          >
            Jimmy Nicholas
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div className={`flex space-x-8 w-full max-w-2xl`} layout>
          {navItems.map(({ path, label }) => (
            <motion.div key={path} className="flex-1 relative min-w-0" layout>
              {!isBusinessMode && <div style={foregroundEffectStyles.overlay} />}
              <div
                className={`border-2 rounded-lg px-8 py-6 text-2xl text-center cursor-pointer transition-all duration-300 relative ${
                  !isBusinessMode ? "crt-scanlines" : ""
                } w-full`}
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
  );
};

export default Navigation;