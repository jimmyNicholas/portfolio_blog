"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Row = { label: string; content: React.ReactNode };
type Section = {
  id: string;
  num: string;
  title: string;
  rows: Row[];
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
        num: "1",
        title: "Context",
        rows: [
          {
            label: "Situation",
            content: (
              <div className="space-y-2 text-sm leading-relaxed">
                <p>In recent years, e-scooter use has become more widespread across Victoria. With large companies such as Lime and Neuron offering short term hire options, access to cheap, fast and environmentally friendly methods to get around has increased usage.</p>
                <p>However, this comes at a cost of safety to the riders with most of the accidents involving young adults and children. In addition, poorly parked e-scooter can limit accessibility for wheelchairs and prams.</p>
              </div>
            ),
          },
          {
            label: "The Issue",
            content: (
              <div className="space-y-2 text-sm leading-relaxed">
                <p>The main issue to address is reducing the number of accidents involving e-scooters and promoting safe use.</p>
                <p>The secondary issue to address is responsible parking and promoting community harmony. Poorly parked e-scooters can limit the accessibility for people in wheelchairs, with prams, and the elderly.</p>
              </div>
            ),
          },
          {
            label: "Key Challenges",
            content: (
              <>
                <ul className="list-disc list-inside">
                  <li>Building learner motivation</li>
                  <li>Understanding local laws</li>
                  <li>Ensuring accessibility for all</li>
                </ul>
              </>
            ),
          },
        ],
        callout: (
          <div className="text-accent text-sm leading-relaxed">
          Possible callout
          </div>
        ),
      },
      {
        id: "people",
        num: "2",
        title: "People",
        rows: [
          {
            label: "Learners",
            content: (
              <div className="space-y-2 text-sm leading-relaxed">
                <p>Teenagers and adolescents who are most likely active and social with a good group of friends. They are time rich, but particular on how they use that time. They usually make good decisions, but sometimes take risks without considering the consequences.</p>
                <p>They most likely already know the rules, but reviewing them and the impact they can have is useful. This means that tone, looks and feel are important.</p>
              </div>
            ),
          },
          {
            label: "Stakeholders",
            content: (
              <div className="space-y-2 text-sm leading-relaxed">
                <p>The variety of possible stakeholders means that this project is built to be easily customisable based on the organisation and their goals.</p>
              <p>
                <strong>Victoria Government (PSA):</strong> local councils, Transport Victoria,
                state government, TAC, Victoria Walks
              </p>
              <p>
                <strong>eScooter companies (in‑app):</strong> Lime, Neuron
              </p>
              <p>
                <strong>Victoria Police (rehab / community):</strong> police diversion and
                community engagement programs
              </p>
              <p>
                <strong>Insurance (safety promotion):</strong> RACV and other insurers
              </p>
            </div>
            ),
          },
        ],
      },
      {
        id: "delivery",
        num: "3",
        title: "Delivery",
        rows: [
          {
            label: "Format",
            content: (
              <span>
                Micro-lessons (2–5 minutes) with scenario prompts and quick
                checks. <Pills items={["Media", "Scenarios"]} />
              </span>
            ),
          },
          {
            label: "Platform",
            content: (
              <span>
                Mobile web first; desktop compatible.{" "}
                <Pills items={["Responsive", "Touch-friendly"]} />
              </span>
            ),
          },
          {
            label: "Completion",
            content: (
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
        num: "4",
        title: "Module plan",
        rows: [
          {
            label: "1. Setup",
            content:
              "Helmet, brakes, stance, and a 30-second pre-ride check. What to do if something feels wrong.",
          },
          {
            label: "2. Street reading",
            content:
              "Surface hazards, driveways, door zones, visibility, and predicting car behavior.",
          },
          {
            label: "3. Intersections",
            content:
              "Right-of-way ambiguity, turning conflicts, and speed choices that keep options open.",
          },
          {
            label: "4. Weather/night",
            content:
              "Wet traction, lighting, and the “slower than you think” rule for stopping distance.",
          },
          {
            label: "5. Local norms",
            content:
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
        num: "5",
        title: "Assessment",
        rows: [
          {
            label: "Checks",
            content: (
              <span>
                Low-stakes, frequent, and scenario-based.{" "}
                <Pills items={["Multiple choice", "Image hotspots"]} />
              </span>
            ),
          },
          {
            label: "Passing",
            content:
              "Clear threshold with review loops: if you miss, you see why and retry a parallel scenario.",
          },
          {
            label: "Evidence",
            content: (
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
        num: "6",
        title: "Accessibility",
        rows: [
          {
            label: "Standards",
            content: (
              <span>
                Designed for readable contrast, keyboard navigation, and screen
                reader landmarks. <Pills items={["WCAG", "Keyboard"]} />
              </span>
            ),
          },
          {
            label: "Media",
            content:
              "Captions for video, transcripts for audio, and alt text for diagrams/hazards.",
          },
          {
            label: "Interaction",
            content:
              "No time pressure for essential tasks; avoid motion-only cues; focus states are visible.",
          },
        ],
      },
      {
        id: "build",
        num: "7",
        title: "Build notes",
        rows: [
          {
            label: "Content ops",
            content:
              "Write once, reuse often: scenarios as a library; easy to localize and adapt to city rules.",
          },
          {
            label: "Analytics",
            content:
              "Track drop-off points and question misses to refine where riders struggle most.",
          },
          {
            label: "Iteration",
            content: (
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
            {SECTIONS.map((s) => (
              <TocLink
                key={s.id}
                href={`#${s.id}`}
                active={activeId === s.id}
              >
                <span className="text-accent">{s.num}</span>{" "}
                <span className="text-themed">{s.title}</span>
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
            {SECTIONS.map((s) => (
              <TocLink
                key={s.id}
                href={`#${s.id}`}
                active={activeId === s.id}
              >
                <span className="text-accent">{s.num}</span>{" "}
                <span className="text-themed">{s.title}</span>
              </TocLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="mt-6 md:mt-0 space-y-8">
        {SECTIONS.map((section) => (
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
                    {section.num}
                  </div>
                  <h2 className="font-mono font-bold text-themed text-xl">
                    {section.title}
                  </h2>
                </div>
                {section.callout ? (
                  <div className="hidden lg:block max-w-[40%] border border-secondary/60 rounded-2xl p-4">
                    {section.callout}
                  </div>
                ) : null}
              </header>

              <div className="space-y-4">
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6"
                  >
                    <div className="font-mono text-accent text-sm">
                      {row.label}
                    </div>
                    <div className="text-accent text-sm leading-relaxed">
                      {row.content}
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

