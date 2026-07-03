import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generating Silence – Danger Music Cards | Jimmy Nicholas",
  description:
    "Danger Music cards for the in-person session of the Generating Silence blended course.",
};

export default function DangerCardsPage() {
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
          src="/files/Danger_Cards_In-person_Session.pdf"
          className="w-full h-full"
          title="Danger Music Cards PDF"
        />
      </div>
    </div>
  );
}
