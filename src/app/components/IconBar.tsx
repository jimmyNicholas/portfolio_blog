"use client";
import React from "react";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillMail,
  AiFillSun,
  AiFillMoon,
  AiOutlineFundProjectionScreen,
  AiFillPicture,
} from "react-icons/ai";
import { SiBandcamp } from "react-icons/si";
import { useThemeContext } from "./ThemeProvider";
import PortfolioButton from "./PortfolioButton";
import PortfolioTooltip from "./PortfolioTooltip";

const defaultSize = 32;
const defaultStrokeWidth = 2.2;

const socialLinks = [
  {
    href: "https://github.com/jimmyNicholas",
    label: "GitHub",
    icon: <AiFillGithub size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="GitHub" />,
  },
  {
    href: "https://linkedin.com/in/jimmy-nicholas/",
    label: "LinkedIn",
    icon: (
      <AiFillLinkedin size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="LinkedIn" />
    ),
  },
  {
    href: "mailto:jimmynicholas@duck.com",
    label: "Email",
    icon: <AiFillMail size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="Email" />,
  },
  {
    href: "https://lashlash.bandcamp.com/",
    label: "Bandcamp",
    icon: <SiBandcamp size={defaultSize} strokeWidth={defaultStrokeWidth} aria-label="Bandcamp" />,
  },
];

const iconButtonClass =
  "w-10 h-10 md:w-14 md:h-14 border-2 border-secondary rounded-xl bg-themed/80 text-primary hover:bg-accent hover:text-themed transition-colors shadow-md font-mono text-base relative";

const IconBar: React.FC = () => {
  const { themeMode, styleMode, toggleTheme, toggleStyle } = useThemeContext();

  return (
    <>
      {/* Mobile: unified full-width bar */}
      <div className="fixed top-0 left-0 right-0 w-full z-[100] flex md:hidden flex-row justify-between items-center px-4 py-3">
        <div className="flex flex-row gap-2">
          {socialLinks.map((link) => (
            <PortfolioButton
              key={link.href}
              onClick={() => window.open(link.href, "_blank")}
              aria-label={link.label}
              className={`group flex items-center justify-center ${iconButtonClass}`}
            >
              {link.icon}
              <PortfolioTooltip>{link.label}</PortfolioTooltip>
            </PortfolioButton>
          ))}
        </div>
        <div className="flex flex-row gap-2">
          <PortfolioButton
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={iconButtonClass}
          >
            {themeMode === "dark" ? (
              <AiFillMoon size={defaultSize} strokeWidth={defaultStrokeWidth} />
            ) : (
              <AiFillSun size={defaultSize} strokeWidth={defaultStrokeWidth} />
            )}
            <PortfolioTooltip>
              {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
            </PortfolioTooltip>
          </PortfolioButton>
          <PortfolioButton
            onClick={toggleStyle}
            aria-label="Toggle style mode"
            className={iconButtonClass}
          >
            {styleMode === "business" ? (
              <AiOutlineFundProjectionScreen size={defaultSize} strokeWidth={defaultStrokeWidth} />
            ) : (
              <AiFillPicture size={defaultSize} strokeWidth={defaultStrokeWidth} />
            )}
            <PortfolioTooltip>
              {styleMode === "business" ? "Business Mode" : "Creative Mode"}
            </PortfolioTooltip>
          </PortfolioButton>
        </div>
      </div>

      {/* Desktop: two-sided layout */}
      <div className="hidden md:flex fixed top-4 left-12 z-[100] flex-row gap-3">
        {socialLinks.map((link) => (
          <PortfolioButton
            key={link.href}
            onClick={() => window.open(link.href, "_blank")}
            aria-label={link.label}
            className="group flex items-center justify-center w-14 h-14 border-2 border-secondary rounded-xl bg-themed/80 text-primary hover:bg-accent hover:text-themed transition-colors shadow-md font-mono text-base relative"
          >
            {link.icon}
            <PortfolioTooltip>{link.label}</PortfolioTooltip>
          </PortfolioButton>
        ))}
      </div>
      <div className="hidden md:flex fixed top-4 right-12 flex-row gap-3 z-[100]">
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
    </>
  );
};

export default IconBar;
