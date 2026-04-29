"use client";

import React, { useEffect, useState } from "react";

export default function NoteClusteringPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    // Reuse the same focus-mode mechanism as the Transcript Viewer.
    window.dispatchEvent(
      new CustomEvent<boolean>("transcript-viewer-focus-mode-change", {
        detail: isFullscreen,
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent<boolean>("transcript-viewer-focus-mode-change", {
          detail: false,
        }),
      );
    };
  }, [isFullscreen]);

  const iframeSrc = "/courses/note-clustering/index.html";

  return (
    <div className="max-w-8xl mx-auto px-8 space-y-8">
      <header
        className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-5"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 95%, var(--palette-secondary) 5%)",
        }}
      >
        <div className="space-y-2">
          <h1 className="font-mono font-bold text-themed text-2xl md:text-3xl">
            Note Clustering
          </h1>
          <p className="text-accent leading-relaxed">
            An interactive canvas for clustering notes into meaningful groups.
          </p>
        </div>
      </header>
      <div
        className="border-2 border-secondary rounded-3xl overflow-hidden"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
          height: "calc(100vh - 250px)",
          minHeight: "600px",
        }}
      >
        <div className="relative w-full h-full">
          <iframe
            src={iframeSrc}
            className="absolute inset-0 w-full h-full"
            title="Note Clustering"
          />

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Enter focus mode"
            className="absolute top-4 right-4 z-20 rounded-full border border-primary/70 bg-[color:var(--palette-primary)] px-4 py-2 text-xs font-mono text-themed backdrop-blur-sm shadow-sm hover:bg-[color:var(--palette-primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)]"
          >
            Focus Mode
          </button>
        </div>
      </div>

      {isFullscreen ? (
        <div className="fixed inset-0 z-[600] bg-[color:var(--palette-background)]">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Exit focus mode"
            className="absolute top-4 right-4 z-[700] rounded-full border border-primary/70 bg-[color:var(--palette-primary)] px-4 py-2 text-xs font-mono text-themed backdrop-blur-sm shadow-sm hover:bg-[color:var(--palette-primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)]"
          >
            Exit Focus Mode
          </button>

          <iframe
            src={iframeSrc}
            className="absolute inset-0 w-full h-full"
            title="Note Clustering (Fullscreen)"
          />
        </div>
      ) : null}
    </div>
  );
}

