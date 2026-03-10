import type { CSSProperties, ReactNode } from "react";

export default function StoryBuddyLayout({ children }: { children: ReactNode }) {
  const storyBuddyThemeVars = {
    "--palette-background": "#F8FAFC", // slate-50 (clean canvas)
    "--palette-text": "#0B1220", // near-slate-950 (strong contrast)
    "--palette-primary": "#1E40AF", // blue-800 (accessible focus/CTA)
    "--palette-secondary": "#94A3B8", // slate-400 (borders/dividers)
    "--palette-accent": "#334155", // slate-700 (secondary text)
  } as CSSProperties;

  return (
    <div className="max-w-8xl mx-auto px-8 py-8" style={storyBuddyThemeVars}>
      <div className="rounded-[40px] bg-neutral-100/90 ring-1 ring-black/5 p-4 sm:p-6">
        <main
          className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-sm p-4 sm:p-6 space-y-8"
          role="main"
          aria-label="Story Buddy interactive workspace"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

