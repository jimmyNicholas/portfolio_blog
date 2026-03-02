import type { Metadata } from "next";
import EditorialCoursePlanClient from "./EditorialCoursePlanClient";

export const metadata: Metadata = {
  title: "E-Scooter Safety Course | Jimmy Nicholas",
  description: "A plan for a digital safety course for e-scooter riders.",
};


export default function EScooterSafetyCoursePage() {
  return (
    <div className="max-w-8xl mx-auto px-8 space-y-8">
      <header
        className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-5"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
        }}
      >

        <div className="space-y-2">
          <h1 className="font-mono font-bold text-themed text-2xl md:text-3xl">
            E-Scooter Safety Course
          </h1>
          <p className="text-accent leading-relaxed">
            A plan for a digital safety course for e-scooter riders.
          </p>
        </div>

     
      </header>

      <EditorialCoursePlanClient />
    </div>
  );
}

