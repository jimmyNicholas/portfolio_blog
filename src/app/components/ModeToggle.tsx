"use client";
import React from "react";
import { useThemeContext } from "./ThemeProvider";

const ModeToggle: React.FC = () => {
  const { 
    themeMode, 
    styleMode, 
    toggleTheme, 
    toggleStyle, 
    palette 
  } = useThemeContext();

  const buttonStyle = {
    backgroundColor: palette.background,
    color: palette.text,
    borderColor: palette.secondary,
    borderWidth: "2px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const buttonClassName = "px-4 py-2 rounded-lg border-2 transition-all font-medium hover:opacity-80";

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-[100]">
      <button
        onClick={toggleTheme}
        className={buttonClassName}
        style={buttonStyle}
      >
        {themeMode === "dark" ? "🌙" : "☀️"}
      </button>

      <button
        onClick={toggleStyle}
        className={buttonClassName}
        style={buttonStyle}
      >
        {styleMode === "business" ? "💼 Business" : "🎨 Creative"}
      </button>
    </div>
  );
};

export default ModeToggle; 