import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generating Silence – Session 1 Slides | Jimmy Nicholas",
  description:
    "Session 1 slides and activities for the Generating Silence blended course on experimental music and AI prompting.",
};

export default function Session1SlidesPage() {
  return (
    <div className="max-w-8xl mx-auto px-8 space-y-8">
      {/* PDF Viewer */}
      <div
        className="border-2 border-secondary rounded-3xl overflow-hidden"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
          height: "calc(100vh - 250px)",
          minHeight: "600px",
        }}
      >
        <iframe
          src="/files/Session_1_Slides.pdf"
          className="w-full h-full"
          title="Session 1 Slides PDF"
        />
      </div>
    </div>
  );
}
