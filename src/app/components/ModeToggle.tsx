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
import PortfolioTooltip from "./PortfolioTooltip";

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
        <PortfolioTooltip>
          {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
        </PortfolioTooltip>
      </PortfolioButton>

      <PortfolioButton onClick={toggleStyle} aria-label="Toggle style mode">
        {styleMode === "business" ? (
          <AiOutlineFundProjectionScreen size={32} strokeWidth={2.2} />
        ) : (
          <AiFillPicture size={32} strokeWidth={2.2} />
        )}
        <PortfolioTooltip>
          {styleMode === "business" ? "Business Mode" : "Creative Mode"}
        </PortfolioTooltip>
      </PortfolioButton>
    </div>
  );
};

export default ModeToggle;
