"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useThemeContext } from "./ThemeProvider";
import Navigation from "./Navigation";
import ModeToggle from "./ModeToggle";
import SocialLinks from "../components/SocialLinks";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isBusinessMode, isDarkMode, effectStyles } = useThemeContext();

  const isHomePage = pathname === "/";
  const isEmbedRoute = pathname.startsWith("/elicosgamification");

  React.useEffect(() => {
    router.prefetch("/about");
    router.prefetch("/work");
  }, [router]);

  if (isEmbedRoute) {
    return (
      <div className="min-h-screen bg-white text-neutral-900">
        <h1 className="sr-only">Embedded activity</h1>
        {children}
      </div>
    );
  }

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
          {/* Hidden h1 for accessibility - the visible title is in Navigation */}
          <h1 className="sr-only">Jimmy Nicholas - Developer, Educator, and Musician</h1>

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
