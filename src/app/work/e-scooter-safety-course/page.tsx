import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "E-Scooter Safety Course | Jimmy Nicholas",
  description: "A plan for a digital safety course for e-scooter riders.",
};

const TAGS = ["Education", "Digital Teaching", "Code"] as const;

export default function EScooterSafetyCoursePage() {
  return (
    <div className="max-w-5xl mx-auto px-8 space-y-8">
      <div
        className="border-2 border-secondary rounded-3xl p-8 space-y-6"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
        }}
      >
        <div className="space-y-3">
          <h1 className="font-mono font-bold text-themed text-2xl">
            E-Scooter Safety Course
          </h1>
          <p className="text-accent leading-relaxed">
            A plan for a digital safety course for e-scooter riders.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="themed-tag px-2 py-1 rounded-full text-xs font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-2">
            <h2 className="font-mono font-bold text-themed text-base">
              Overview
            </h2>
            <p className="text-accent text-sm leading-relaxed">
              A structured learning experience focused on real-world riding
              scenarios, decision-making, and local safety norms—designed to be
              clear, fast to complete, and mobile-friendly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-themed text-base">
              Direction
            </h2>
            <ul className="text-accent text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Short modules with lightweight checks for understanding</li>
              <li>Scenario-based prompts and hazard recognition</li>
              <li>Clear completion criteria (certificate-ready)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

