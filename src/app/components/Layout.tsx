"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useThemeContext } from "./ThemeProvider";
import Navigation from "./Navigation";
import ModeToggle from "./ModeToggle";
import SocialLinks from "../components/SocialLinks";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isBusinessMode, isDarkMode, effectStyles } = useThemeContext();

  // No longer need to set body classes - useTheme hook handles data attributes

  const isHomePage = pathname === "/";

  return (
    <div
      className="min-h-screen themed-filter bg-themed"
      style={effectStyles.container}
    >
      {!isBusinessMode && <div style={effectStyles.overlay} />}

      <SocialLinks />
      <ModeToggle />

      <div className="min-h-full">
        <div
          className="container mx-auto px-4 py-8 relative space-y-12"
          style={{ zIndex: 10 }}
        >
          <Navigation
            isBusinessMode={isBusinessMode}
            isDarkMode={isDarkMode}
            foregroundEffectStyles={effectStyles}
            isHomePage={isHomePage}
          />

          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;