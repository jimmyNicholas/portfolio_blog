"use client";
import React from "react";
import { AiFillSun, AiFillMoon, AiOutlineFundProjectionScreen, AiFillPicture} from "react-icons/ai";
import { useThemeContext } from "./ThemeProvider";

const ModeToggle: React.FC = () => {
  const {
    themeMode,
    styleMode,
    toggleTheme,
    toggleStyle,
    palette,
  } = useThemeContext();

  const buttonStyle = {
    backgroundColor: palette.background,
    color: palette.text,
    borderColor: palette.secondary,
    borderWidth: "2px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const buttonClassName =
    "group flex items-center justify-center w-14 h-14 border-2 rounded-xl bg-themed/80 text-accent hover:bg-accent hover:text-themed transition-colors shadow-md font-mono text-base relative";

  return (
    <div className="fixed top-4 right-12 flex flex-row gap-3 z-[100]">
      <button
        onClick={toggleTheme}
        className={buttonClassName}
        style={buttonStyle}
        aria-label="Toggle theme"
      >
        {themeMode === "dark" ? (
          <AiFillMoon size={32} strokeWidth={2.2} />
        ) : (
          <AiFillSun size={32} strokeWidth={2.2} />
        )}
        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-1/2 translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-secondary text-themed text-sm whitespace-nowrap shadow-lg z-50">
          {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      </button>

      <button
        onClick={toggleStyle}
        className={buttonClassName}
        style={buttonStyle}
        aria-label="Toggle style mode"
      >
        {styleMode === "business" ? (
          <AiOutlineFundProjectionScreen size={32} strokeWidth={2.2} />
        ) : (
          <AiFillPicture size={32} strokeWidth={2.2} />
        )}
        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-1/2 translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-secondary text-themed text-sm whitespace-nowrap shadow-lg z-50">
          {styleMode === "business" ? "Business Mode" : "Creative Mode"}
        </span>
      </button>
    </div>
  );
};

export default ModeToggle; 