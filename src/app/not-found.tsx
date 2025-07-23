'use client';
import React from "react";
import Link from "next/link";
import { useThemeContext } from "./components/ThemeProvider";

export default function NotFound() {
  const { palette } = useThemeContext();

  return (
    <div
      className="min-h-400px flex flex-col items-center justify-center space-y-8 crt-scanlines"
      style={{
        background: palette.background,
        color: palette.text,
        border: `2px solid ${palette.secondary}`,
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: `0 0 0.5rem ${palette.accent}`,
      }}
    >
      <h1 style={{ color: palette.primary }} className="text-5xl font-bold">404</h1>
      <p className="text-xl">Sorry, this page could not be found.</p>
      <Link
        href="/"
        style={{ color: palette.accent, textDecoration: 'underline', fontSize: '1.125rem' }}
      >
        Go Home
      </Link>
    </div>
  );
} 