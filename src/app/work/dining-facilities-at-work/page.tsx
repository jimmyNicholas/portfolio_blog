import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dining Facilities at Work | Jimmy Nicholas",
  description:
    "An interactive RISE 360 course about workplace dining facilities and etiquette.",
};

export default function DiningFacilitiesPage() {
  return (
    <div className="max-w-8xl mx-auto px-8 space-y-8">
      {/* RISE 360 Course Viewer */}
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
          src="/courses/dining-facilities-at-work/index.html"
          className="w-full h-full"
          title="Dining Facilities at Work - RISE 360 Course"
        />
      </div>
    </div>
  );
}
