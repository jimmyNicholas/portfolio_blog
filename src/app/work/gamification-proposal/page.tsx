import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamification – Design Proposal | Jimmy Nicholas",
  description:
    "A blended learning design proposal for Australian ELICOS teachers.",
};

export default function GamificationProposalPage() {
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
          src="/files/Design_Proposal_Jimmy_Nicholas.pdf"
          className="w-full h-full"
          title="Gamification Design Proposal PDF"
        />
      </div>
    </div>
  );
}
