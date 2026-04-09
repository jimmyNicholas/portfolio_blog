import { Metadata } from "next";
import SlideshowClient from "./SlideshowClient";

export const metadata: Metadata = {
  title: "Story Buddy | Jimmy Nicholas",
  description: "A collaborative AI storytelling guide.",
};

export default function StoryBuddyPage() {
  return (
    <div className="max-w-8xl mx-auto px-8 space-y-8">
      <header
        className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-3"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
        }}
      >
        <h1 className="font-mono font-bold text-themed text-2xl md:text-3xl">
          Story Buddy
        </h1>
        <p className="text-accent leading-relaxed">
          A collaborative AI storytelling guide.
        </p>
      </header>

      <SlideshowClient />

      <div
        className="border-2 border-secondary rounded-3xl p-6 md:p-8"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://jimmynicholas.com/work/story_buddy/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-2xl border-2 border-primary text-center font-mono text-themed hover:bg-[color:var(--palette-primary)]/10 transition-colors"
          >
            View live project
          </a>
          <div className="space-y-2">
            <a
              href="https://narinav1.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl border-2 border-primary text-center font-mono text-themed hover:bg-[color:var(--palette-primary)]/10 transition-colors"
            >
              View rebuild (in progress)
              <p className="text-xs text-center text-muted">(Requires login)</p>
            </a>
        </div>
      </div>
    </div>
    </div>
  );
}
