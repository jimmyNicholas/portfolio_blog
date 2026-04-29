"use client";

import { useEffect, useRef, useState } from "react";
import PageWrapper from "@/app/components/PageWrapper";
import TranscriptViewer from "@/app/components/transcript-viewer/TranscriptViewer";

export default function TranscriptViewerPage() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTopOffset, setFocusTopOffset] = useState(96);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onFocusModeChange = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<boolean>;
      setIsFocusMode(Boolean(customEvent.detail));
    };
    window.addEventListener("transcript-viewer-focus-mode-change", onFocusModeChange);
    return () => {
      window.removeEventListener("transcript-viewer-focus-mode-change", onFocusModeChange);
    };
  }, []);

  const requestToggleFocusMode = () => {
    window.dispatchEvent(new Event("transcript-viewer-focus-mode-toggle-request"));
  };

  useEffect(() => {
    const updateFocusTopOffset = () => {
      if (!headerRef.current) return;
      const nextTop = Math.ceil(headerRef.current.getBoundingClientRect().bottom) + 8;
      setFocusTopOffset(nextTop);
    };

    updateFocusTopOffset();
    window.addEventListener("resize", updateFocusTopOffset);
    return () => {
      window.removeEventListener("resize", updateFocusTopOffset);
    };
  }, [isFocusMode]);

  return (
    <PageWrapper maxWidth="max-w-[1500px]">
      <section className="space-y-4">
        <header ref={headerRef} className="space-y-1 relative z-[210]">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-mono text-2xl font-bold text-themed">
              Anthropic Interviewer: Transcript Viewer
            </h1>
            <button
              type="button"
              onClick={requestToggleFocusMode}
              className="rounded-lg border border-secondary px-2.5 py-1.5 text-xs sm:px-3"
            >
              {isFocusMode ? "Exit focus mode" : "Focus mode"}
            </button>
          </div>
          {!isFocusMode ? (
            <p className="text-sm text-secondary mt-1">
              Browse interview transcripts with searchable, filterable AI/User
              separation.{" "}
              <a
                href="https://www.anthropic.com/research/anthropic-interviewer"
                target="_blank"
                rel="noopener noreferrer"
              >
                MORE INFO AT THIS LINK
              </a>
            </p>
          ) : null}
        </header>
        <TranscriptViewer focusTopOffset={focusTopOffset} />
      </section>
    </PageWrapper>
  );
}
