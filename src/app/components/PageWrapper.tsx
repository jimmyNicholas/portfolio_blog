"use client";
import React from "react";
import { motion } from "framer-motion";
import { useThemeContext } from "./ThemeProvider";

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  maxWidth = "max-w-4xl",
}) => {
  const { isBusinessMode, effectStyles } = useThemeContext();
  return (
    <motion.div
      className={`${maxWidth} mx-auto px-8`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mt-8">
        <div
          className={`p-8 rounded-2xl relative bg-themed border-2 border-secondary ${
            !isBusinessMode ? "crt-scanlines film-grain" : ""
          }`}
          style={{
            boxShadow: "0 0 20px color-mix(in srgb, var(--palette-accent) 30%, transparent)",
            ...effectStyles.container,
          }}
        >
          {!isBusinessMode && <div style={effectStyles.overlay} />}
          <div className="text-accent relative z-10">{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default PageWrapper;
