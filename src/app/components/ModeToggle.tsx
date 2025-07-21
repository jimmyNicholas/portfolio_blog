"use client";
import React from "react";
import {
  AiFillSun,
  AiFillMoon,
  AiOutlineFundProjectionScreen,
  AiFillPicture,
} from "react-icons/ai";
import { useThemeContext } from "./ThemeProvider";
import PortfolioButton from "./PortfolioButton";


const ModeToggle: React.FC = () => {
  const { themeMode, styleMode, toggleTheme, toggleStyle } = useThemeContext();

  return (
    <div className="fixed top-4 right-12 flex flex-row gap-3 z-[100]">
      <PortfolioButton onClick={toggleTheme} aria-label="Toggle theme">
        {themeMode === "dark" ? (
          <AiFillMoon size={32} strokeWidth={2.2} />
        ) : (
          <AiFillSun size={32} strokeWidth={2.2} />
        )}
        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-1/2 translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-secondary text-themed text-sm whitespace-nowrap shadow-lg z-50">
          {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      </PortfolioButton>

      <PortfolioButton onClick={toggleStyle} aria-label="Toggle style mode">
        {styleMode === "business" ? (
          <AiOutlineFundProjectionScreen size={32} strokeWidth={2.2} />
        ) : (
          <AiFillPicture size={32} strokeWidth={2.2} />
        )}
        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-1/2 translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-secondary text-themed text-sm whitespace-nowrap shadow-lg z-50">
          {styleMode === "business" ? "Business Mode" : "Creative Mode"}
        </span>
      </PortfolioButton>
    </div>
  );
};

export default ModeToggle;
