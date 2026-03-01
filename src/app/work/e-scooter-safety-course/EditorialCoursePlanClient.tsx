"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Row = { postLabel: string; postContent: React.ReactNode };
type Section = {
  id: string;
  postTitle: string;
  postRows: Row[];
  callout?: React.ReactNode;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="themed-tag px-2 py-1 rounded-full text-xs font-mono">
      {children}
    </span>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <span className="inline-flex flex-wrap gap-2 align-middle">
      {items.map((x) => (
        <Pill key={x}>{x}</Pill>
      ))}
    </span>
  );
}

function TocLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`block rounded-xl border px-3 py-2 text-sm font-mono transition-colors ${
        active
          ? "border-secondary text-themed"
          : "border-secondary/60 text-accent hover:border-secondary hover:text-themed"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)]`}
    >
      {children}
    </a>
  );
}

export default function EditorialCoursePlanClient() {
  const SECTIONS: Section[] = useMemo(
    () => [
      {
        id: "context",
        postTitle: "Context",
        postRows: [
          {
        postLabel: "Situation",
        postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
        <p>Most young e-scooter riders already know the rules. The problem is they don&apos;t always follow them. In Victoria, e-scooter Emergency Department presentations increased nearly fiftyfold between 2017/18 and 2022/23, with young adults aged 15–24 the most frequently injured (Berecki-Gisolf & Hayman, 2024). Beyond personal safety, poorly parked scooters regularly block access for wheelchair users, pram users, and the elderly.</p>
        </div>
            ),
          },
          {
        postLabel: "Audience",
        postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
        <p>This course is designed for teenagers and young adults, on behalf of stakeholders such as VicRoads, TAC, and e-scooter operators. The challenge is designing for learners who are time-poor, socially motivated, and unlikely to engage with content from authority figures.</p>
        </div>
          ),
        }
      ],
      },
      
{
  id: "presentation",
postTitle: "Presentation",
postRows: [
    {
postLabel: "Accessibility ",
postContent: (
<div className="space-y-2 text-sm leading-relaxed">
<p>Built to WCAG 2.1 AA standards (W3C, 2018) using Articulate Rise, the course will include high contrast visuals, scalable font (min 12px), descriptive alt-text for images and videos, and full keyboard navigability (CAST, 2024, Guidelines 1.1, 4.1).</p>
</div>
      ),
    },
    {
postLabel: "Tone",
postContent: (
<div className="space-y-2 text-sm leading-relaxed">
<p>The general tone will be “Chill Dad” to avoid being authoritative. “Hey I know you know, but here’s the reason”. This will build trust by honouring their intelligence while enhancing their understanding (CAST, 2024, Guideline 3.1). Research supports empathy-based messaging over fear-based approaches in road safety education for young people (Waring et al., 2024).</p>
</div>
      ),
    }
],
},
      {
        id: "delivery",
        postTitle: "Delivery",
        postRows: [
          {
            postLabel: "Format",
            postContent: (
              <span>
                Micro-lessons (2–5 minutes) with scenario prompts and quick
                checks. <Pills items={["Media", "Scenarios"]} />
              </span>
            ),
          },
          {
            postLabel: "Platform",
            postContent: (
              <span>
                Mobile web first; desktop compatible.{" "}
                <Pills items={["Responsive", "Touch-friendly"]} />
              </span>
            ),
          },
          {
            postLabel: "Completion",
            postContent: (
              <span>
                Certificate-ready outcome, exportable proof.{" "}
                <Pills items={["Assessment", "Verification"]} />
              </span>
            ),
          },
        ],
      },
      {
        id: "modules",
        postTitle: "Module plan",
        postRows: [
          {
            postLabel: "1. Setup",
            postContent:
              "Helmet, brakes, stance, and a 30-second pre-ride check. What to do if something feels wrong.",
          },
          {
            postLabel: "2. Street reading",
            postContent:
              "Surface hazards, driveways, door zones, visibility, and predicting car behavior.",
          },
          {
            postLabel: "3. Intersections",
            postContent:
              "Right-of-way ambiguity, turning conflicts, and speed choices that keep options open.",
          },
          {
            postLabel: "4. Weather/night",
            postContent:
              "Wet traction, lighting, and the “slower than you think” rule for stopping distance.",
          },
          {
            postLabel: "5. Local norms",
            postContent:
              "Sidewalk vs road decisions, shared paths, and courtesy behaviors that reduce conflict.",
          },
        ],
        callout: (
          <div className="flex flex-wrap gap-2">
            <Pill>Short modules</Pill>
            <Pill>One decision per screen</Pill>
            <Pill>Real-world prompts</Pill>
          </div>
        ),
      },
      {
        id: "assessment",
        postTitle: "Assessment",
        postRows: [
          {
            postLabel: "Checks",
            postContent: (
              <span>
                Low-stakes, frequent, and scenario-based.{" "}
                <Pills items={["Multiple choice", "Image hotspots"]} />
              </span>
            ),
          },
          {
            postLabel: "Passing",
            postContent:
              "Clear threshold with review loops: if you miss, you see why and retry a parallel scenario.",
          },
          {
            postLabel: "Evidence",
            postContent: (
              <span>
                Completion record with timestamp and optional identity step.{" "}
                <Pills items={["Certificate", "Audit trail"]} />
              </span>
            ),
          },
        ],
      },
      {
        id: "accessibility",
        postTitle: "Accessibility",
        postRows: [
          {
            postLabel: "Standards",
            postContent: (
              <span>
                Designed for readable contrast, keyboard navigation, and screen
                reader landmarks. <Pills items={["WCAG", "Keyboard"]} />
              </span>
            ),
          },
          {
            postLabel: "Media",
            postContent:
              "Captions for video, transcripts for audio, and alt text for diagrams/hazards.",
          },
          {
            postLabel: "Interaction",
            postContent:
              "No time pressure for essential tasks; avoid motion-only cues; focus states are visible.",
          },
        ],
      },
      {
        id: "build",
        postTitle: "Build notes",
        postRows: [
          {
            postLabel: "Content ops",
            postContent:
              "Write once, reuse often: scenarios as a library; easy to localize and adapt to city rules.",
          },
          {
            postLabel: "Analytics",
            postContent:
              "Track drop-off points and question misses to refine where riders struggle most.",
          },
          {
            postLabel: "Iteration",
            postContent: (
              <span>
                Start with MVP modules, then add higher fidelity visuals.{" "}
                <Pills items={["MVP", "Iterate"]} />
              </span>
            ),
          },
        ],
      },
    ],
    [],
  );

  const [activeId, setActiveId] = useState(SECTIONS[0]?.id ?? "context");
  const sectionElsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const elements = SECTIONS.map((s) => sectionElsRef.current[s.id]).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0),
          );
        const next = visible[0]?.target?.id;
        if (next) setActiveId(next);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5],
        rootMargin: "-15% 0px -70% 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [SECTIONS]);

  return (
    <div className="md:grid md:grid-cols-[280px_1fr] md:gap-10">
      <nav aria-label="Contents" className="space-y-3">
        {/* Mobile TOC */}
        <div
          className="md:hidden -mx-2 px-2 pb-1 overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-max">
            {SECTIONS.map((s, i) => (
              <TocLink
                key={s.id}
                href={`#${s.id}`}
                active={activeId === s.id}
              >
                <span className="text-accent">{i + 1}</span>{" "}
                <span className="text-themed">{s.postTitle}</span>
              </TocLink>
            ))}
          </div>
        </div>

        {/* Desktop TOC */}
        <div
          className="hidden md:block border-2 border-secondary rounded-3xl p-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--palette-background) 92%, var(--palette-secondary) 8%)",
            position: "sticky",
            top: "1.25rem",
          }}
        >
          <div className="font-mono font-bold text-themed text-sm mb-3">
            Contents
          </div>
          <div className="space-y-2">
            {SECTIONS.map((s, i) => (
              <TocLink
                key={s.id}
                href={`#${s.id}`}
                active={activeId === s.id}
              >
                <span className="text-accent">{i + 1}</span>{" "}
                <span className="text-themed">{s.postTitle}</span>
              </TocLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="mt-6 md:mt-0 space-y-8">
        {SECTIONS.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              sectionElsRef.current[section.id] = el;
            }}
            className="scroll-mt-28"
          >
            <div
              className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-6"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
              }}
            >
              <header className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                  <div className="font-mono text-accent text-sm">
                    {index + 1}
                  </div>
                  <h2 className="font-mono font-bold text-themed text-xl">
                    {section.postTitle}
                  </h2>
                </div>
                {section.callout ? (
                  <div className="hidden lg:block max-w-[40%] border border-secondary/60 rounded-2xl p-4">
                    {section.callout}
                  </div>
                ) : null}
              </header>

              <div className="space-y-4">
                {section.postRows.map((row) => (
                  <div
                    key={row.postLabel}
                    className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-2 lg:gap-6"
                  >
                    <div className="font-mono text-accent font-bold">
                      {row.postLabel}
                    </div>
                    <div className="text-accent leading-relaxed mb-2">
                      {row.postContent}
                    </div>
                  </div>
                ))}
              </div>

              {section.callout ? (
                <div className="lg:hidden border border-secondary/60 rounded-2xl p-4">
                  {section.callout}
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

