"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import figure1 from "../images/figure1.png";
import figure2 from "../images/Figure2.png";
import figure4 from "../images/Figure4.png";

type Row = { postLabel: string; postContent: React.ReactNode };
type Section = {
  id: string;
  postTitle: string; 
  postRows: Row[];
  callout?: React.ReactNode;
};

const FIGURE_1_HOVER_TEXT =
  "Figure 1. Emergency department presentations for injuries related to e-scooters in Victoria, 2017/18 to 2022/23: Age-standardised rates per sex and age group. Reprinted from Injuries associated with e-scooters, e-bikes and other e-micromobility devices: Analysis of emergency department presentations and deaths in Victoria, 2016 to 2023 (HAZARD Edition 93, p. 14), by J. Berecki-Gisolf and J. Hayman, 2024, Monash University Accident Research Centre.";

const FIGURE_1_CAPTION =
  "Figure 1. E-scooter ED presentations by age and sex, Victoria 2017/18–2022/23. From Berecki-Gisolf & Hayman (2024).";

const FIGURE_1_ALT =
  "Emergency department presentations for injuries related to e-scooters in Victoria, 2017/18 to 2022/23, by age and sex.";

const FIGURE_2_CAPTION =
  "Figure 2. E-scooter injury rates by Victorian local government area. From Injury Atlas (n.d.).";

const FIGURE_2_ALT =
  "Choropleth map of e-scooter injury rates by Victorian local government area.";

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
                <p>
                  Most young e-scooter riders already know the rules. The
                  problem is they don&apos;t always follow them. In Victoria,
                  e-scooter Emergency Department presentations increased nearly
                  fiftyfold between 2017/18 and 2022/23, with young adults aged
                  15–24 the most frequently injured (Berecki-Gisolf &amp;
                  Hayman, 2024). Beyond personal safety, poorly parked scooters
                  regularly block access for wheelchair users, pram users, and
                  the elderly.
                </p>
                <div className="mt-4">
                  <figure
                    className="max-w-2xl mx-auto border border-secondary overflow-hidden"
                    title={FIGURE_1_HOVER_TEXT}
                  >
                    <Image
                      src={figure1}
                      alt={FIGURE_1_ALT}
                      className="w-full h-auto"
                    />
                    <figcaption className="px-3 py-2 text-[0.75rem] text-themed leading-snug">
                      {FIGURE_1_CAPTION}
                      <div className="mt-1">
                        <a
                          href="#figure-1"
                          className="underline text-muted hover:text-secondary"
                        >
                          See full-size Figure 1 ↓
                        </a>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            ),
          },
          {
            postLabel: "Audience",
            postContent: (
              <div className="space-y-2 text-sm leading-relaxed">
                <p>
                  This course is designed for teenagers and young adults, on
                  behalf of stakeholders such as VicRoads, TAC, and e-scooter
                  operators. The challenge is designing for learners who are
                  time-poor, socially motivated, and unlikely to engage with
                  content from authority figures.
                </p>
              </div>
            ),
          },
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
<p>Built to WCAG 2.1 AA standards (W3C, 2018) using Articulate Rise, the course will include high contrast visuals, scalable font (minimum 12px), descriptive alt-text for images and videos, and full keyboard navigability (CAST, 2024, Guidelines 1.1, 4.1).</p>
</div>
      ),
    },
    {
postLabel: "Tone",
postContent: (
<div className="space-y-2 text-sm leading-relaxed">
<p>The general tone will be “Chill Dad” to avoid being authoritative. “Hey, I know you know, but here’s the reason”. This will build trust by honouring their intelligence while enhancing their understanding (CAST, 2024, Guideline 3.1). Research supports empathy-based messaging over fear-based approaches in road safety education for young people (Waring et al., 2024).</p>
</div>
      ),
    }
],
},
{
  id: "resources",
  postTitle: "Resources",
  postRows: [
    {
      postLabel: "Hosting",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>Course content is hosted via the stakeholder&apos;s existing LMS or embedded directly into an app or webpage, reducing friction for both learners and administrators.</p>
        </div>
      ),
    },
    {
      postLabel: "Content",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>Real-world resources including news articles, images, and video are archived locally to prevent dead links (CAST, 2024, Guideline 5.1). Local and authentic imagery is preferred to optimise relevance and authenticity for learners (CAST, 2024, Guideline 7.2). Owners will be consulted and credited.</p>
        </div>
      ),
    },
  ],
},
{
  id: "communication",
  postTitle: "Communication",
  postRows: [
    {
      postLabel: "Location",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>
            Learners select their general location using a map showing local
            e-scooter incident data. This dynamically adjusts content to include
            local examples, grounding learning in authentic, recognisable
            contexts (Lave &amp; Wenger, 1991; CAST, 2024, Guideline 7.2). A
            live map with incident pins gives learners the option to contribute
            their own (CAST, 2024, Guideline 8.4).
          </p>
          <div className="mt-4">
            <figure
              className="max-w-2xl mx-auto border border-secondary overflow-hidden"
              title={FIGURE_2_CAPTION}
            >
              <Image
                src={figure2}
                alt={FIGURE_2_ALT}
                className="w-full h-auto"
              />
              <figcaption className="px-3 py-2 text-[0.75rem] text-themed leading-snug">
                {FIGURE_2_CAPTION}
                <div className="mt-1">
                  <a
                    href="#figure-2"
                    className="underline text-muted hover:text-secondary"
                  >
                    See full-size Figure 2 ↓
                  </a>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      ),
    },
    {
      postLabel: "Personas",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>Three agentic digital instructors represent the social (good mate), the public (community impact), and the law (legal consequences), reflecting a diversity of perspectives (CAST, 2024, Guideline 1.3).</p>
        </div>
      ),
    },
  ],
},
{
  id: "practice",
  postTitle: "Practice",
  postRows: [
    {
      postLabel: "Key Terms",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>A simple matching activity clarifies language structures to reduce cognitive load, especially for CALD learners (CAST, 2024, Guideline 2.1).</p>
        </div>
      ),
    },
    {
      postLabel: "Guess What Happens Next",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>
            Short-form videos are partly played so learners can predict outcomes
            before seeing them. This invites consequence prediction using
            familiar media formats, making stakes tangible before any rules are
            introduced (CAST, 2024, Guideline 2.5).
          </p>
          <div className="mt-4">
  <figure className="max-w-2xl mx-auto border border-secondary overflow-hidden">
    <div className="relative w-full pt-[177.78%] overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/uJwy0QhfBCw?start=0&end=15"
        title="Guess What Happens Next (setup)"
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>

    <figcaption className="px-3 py-2 text-[0.8rem] text-themed leading-snug">
      Nashville Bird Fail! (n.d.). [Video recording]. Retrieved March 2, 2026,
      from{" "}
      <a
        href="https://www.youtube.com/shorts/uJwy0QhfBCw"
        className="underline"
        target="_blank"
        rel="noreferrer"
      >
        https://www.youtube.com/shorts/uJwy0QhfBCw
      </a>
      .
      <div className="mt-1">
        <a
          href="#guess-activity"
          className="underline text-muted hover:text-secondary text-xs font-mono"
        >
          Try the full activity with options and reveal ↓
        </a>
      </div>
    </figcaption>
  </figure>
</div>
        </div>
      ),
    },
    {
      postLabel: "Situation Branching",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>Branching scenarios adapt dynamically to learner responses, so those who demonstrate existing knowledge move forward while those who need support receive it without being made aware of the adjustment, which reduces the risk of confidence loss (CAST, 2024, Guideline 8.2; Merrill, 2002).</p>
        </div>
      ),
    },
    {
      postLabel: "Game",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>
            &quot;You Can&apos;t Park There!&quot; is a low-stakes
            consolidation activity that reinforces responsible parking
            behaviour. Gamified approaches have demonstrated effectiveness in
            improving motivation and knowledge retention (Pham et al., 2025).
          </p>
          <div className="mt-4">
            <figure
              className="max-w-2xl mx-auto border border-secondary overflow-hidden"
              title='Figure 4. Draft screen designs for the "You Can&apos;t Park There!" game. Generated using ChatGPT (2026).'
            >
              <Image
                src={figure4}
                alt='Draft screen designs for the "You Can&apos;t Park There!" game.'
                className="w-full h-auto"
              />
              <figcaption className="px-3 py-2 text-[0.75rem] text-themed leading-snug">
                Figure 4. Draft screen designs for the &quot;You Can&apos;t
                Park There!&quot; game. Generated using ChatGPT (2026).
                <div className="mt-1">
                  <a
                    href="#figure-4"
                    className="underline text-muted hover:text-secondary"
                  >
                    See full-size Figure 4 ↓
                  </a>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      ),
    },
  ],
},
{
  id: "assessment",
  postTitle: "Assessment",
  postRows: [
    {
      postLabel: "Test",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>A ten-question open-book test with a 90% threshold provides a clear, achievable target. Using flexible pacing and targeted supports, learners progress through cycles of demonstration and feedback until mastery is reached (Bergmann, 2022). Multiple versions of the test are used across attempts to reduce the value of guessing (CAST, 2024, Guideline 6.4).</p>
        </div>
      ),
    },
    {
      postLabel: "Support",
      postContent: (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>Failure triggers a supportive response rather than a dead end. Personas guide learners directly to the content they need, offering action-oriented feedback that reduces anxiety and maintains momentum (CAST, 2024, Guideline 8.5; Vygotsky, 1978).</p>
        </div>
      ),
    },
  ],
},
{
  id: "references",
  postTitle: "References",
  postRows: [
    {
      postLabel: "",
      postContent: (
        <div className="text-sm leading-relaxed space-y-3">
          <p className="pl-8 -indent-8">Berecki-Gisolf, J., & Hayman, J. (2024). Injuries associated with e-scooters, e-bikes and other e-micromobility devices: Analysis of emergency department presentations and deaths in Victoria, 2016 to 2023 (HAZARD Edition 93). Monash University Accident Research Centre.</p>
          <p className="pl-8 -indent-8">Bergmann, J. (2022). <em>The mastery learning handbook: A competency-based approach to student achievement.</em> ASCD.</p>
          <p className="pl-8 -indent-8">CAST. (2024). <em>Universal design for learning guidelines version 3.0.</em> <a href="https://udlguidelines.cast.org" className="underline text-blue-600 hover:text-blue-800">https://udlguidelines.cast.org</a></p>
          <p className="pl-8 -indent-8">Injury Atlas. (n.d.). Retrieved March 2, 2026, from <a href="https://vicinjuryatlas.org.au/transport/" className="underline text-blue-600 hover:text-blue-800">https://vicinjuryatlas.org.au/transport/</a></p>
          <p className="pl-8 -indent-8">Lave, J., & Wenger, E. (1991). <em>Situated learning: Legitimate peripheral participation.</em> Cambridge University Press.</p>
          <p className="pl-8 -indent-8">Merrill, M. D. (2002). First principles of instruction. <em>Educational Technology Research and Development, 50</em>(3), 43–59. <a href="https://doi.org/10.1007/BF02505024" className="underline text-blue-600 hover:text-blue-800">https://doi.org/10.1007/BF02505024</a></p>
          <p className="pl-8 -indent-8">Nawaz, I., Cuenen, A., Wets, G., Paul, R., & Janssens, D. (2025). Advancing online road safety education: A gamified approach for secondary school students in Belgium. <em>Applied Sciences, 15</em>(15), 8557. <a href="https://doi.org/10.3390/app15158557" className="underline text-blue-600 hover:text-blue-800">https://doi.org/10.3390/app15158557</a></p>
          <p className="pl-8 -indent-8">Vygotsky, L. S. (1978). <em>Mind in society: The development of higher psychological processes.</em> Harvard University Press.</p>
          <p className="pl-8 -indent-8">W3C. (2018). <em>Web content accessibility guidelines (WCAG) 2.1.</em> <a href="https://www.w3.org/TR/WCAG21/" className="underline text-blue-600 hover:text-blue-800">https://www.w3.org/TR/WCAG21/</a></p>
          <p className="pl-8 -indent-8">Waring, S., Almond, L., & Halsall, L. (2024). Examining the effectiveness of an education-based road safety intervention and the design and delivery mechanisms that promote road safety in young people. <em>Transportation Research Part F: Traffic Psychology and Behaviour, 105,</em> 336–349. <a href="https://doi.org/10.1016/j.trf.2024.07.019" className="underline text-blue-600 hover:text-blue-800">https://doi.org/10.1016/j.trf.2024.07.019</a></p>
        </div>
      ),
    },
  ],
}
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
    <div className="space-y-8">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
        <nav aria-label="Contents" className="space-y-3">
        {/* Mobile TOC */}
        <div
          className="lg:hidden -mx-2 px-2 pb-1 overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 min-w-max">
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
          className="hidden lg:block border-2 border-secondary rounded-3xl p-4"
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
                    "color-mix(in srgb, var(--palette-background) 95%, var(--palette-secondary) 5%)",
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
                      className="grid grid-cols-1 xl:grid-cols-[180px_1fr] gap-2 xl:gap-6"
                    >
                      <div className="font-mono text-primary font-bold">
                        {row.postLabel}
                      </div>
                      <div className="text-[var(--palette-text)] leading-relaxed mb-2">
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

      <section id="figure-1" className="scroll-mt-28">
        <div
          className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
          }}
        >
          <h2 className="font-mono font-bold text-themed text-xl">
            Figure 1
          </h2>
          <figure className="w-full border border-secondary overflow-hidden">
            <Image
              src={figure1}
              alt={FIGURE_1_ALT}
              className="w-full h-auto"
            />
            <figcaption className="px-3 py-2 text-[0.8rem] text-themed leading-snug">
              {FIGURE_1_HOVER_TEXT}
              <div className="mt-1">
                <a
                  href="#context"
                  className="underline text-muted hover:text-secondary text-xs font-mono"
                >
                  Back to Context ↑
                </a>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="figure-2" className="scroll-mt-28">
        <div
          className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
          }}
        >
          <h2 className="font-mono font-bold text-themed text-xl">
            Figure 2
          </h2>
          <figure className="w-full border border-secondary overflow-hidden">
            <Image
              src={figure2}
              alt={FIGURE_2_ALT}
              className="w-full h-auto"
            />
            <figcaption className="px-3 py-2 text-[0.8rem] text-themed leading-snug">
              {FIGURE_2_CAPTION}
              <div className="mt-1">
                <a
                  href="#communication"
                  className="underline text-muted hover:text-secondary text-xs font-mono"
                >
                  Back to Communication ↑
                </a>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="guess-activity" className="scroll-mt-28">
        <div className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-4"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
        }}
        >
          <h2 className="font-mono font-bold text-themed text-xl">
            Figure 3. Guess What Happens Next
          </h2>
          <div className="grid gap-4 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-[30%_auto_30%] items-start bg-white p-4">
            <div className="w-full mx-auto md:mx-0">
              <div className="relative w-full pt-[177.78%] overflow-hidden border border-secondary">
                <iframe
                  src="https://www.youtube.com/embed/uJwy0QhfBCw?start=0&end=15"
                  title="Guess What Happens Next (setup)"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="text-sm text-accent font-mono space-y-3">
              <div className="uppercase tracking-wide text-xs text-themed">
                What happens next?
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-full border border-secondary bg-themed hover:bg-primary/10 text-themed transition-colors"
                >
                  1. She hits a parked car
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-full border border-secondary bg-themed hover:bg-primary/10 text-themed transition-colors"
                >
                  2. She falls over in traffic
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-full border border-secondary bg-themed hover:bg-primary/10 text-themed transition-colors"
                >
                  3. She gets hit by a bird
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-full border border-secondary bg-themed hover:bg-primary/10 text-themed transition-colors"
                >
                  4. The police stop her
                </button>
              </div>
            </div>

            <div className="w-full mx-auto md:mx-0">
              <div className="relative w-full pt-[177.78%] overflow-hidden border border-secondary">
                <iframe
                  src="https://www.youtube.com/embed/uJwy0QhfBCw"
                  title="Guess What Happens Next (answer)"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          <div className="text-left mt-2">
            <a
              href="#practice"
              className="underline text-muted hover:text-secondary text-xs font-mono"
            >
              Back to Practice ↑
            </a>
          </div>
        </div>
      </section>

      <section id="figure-4" className="scroll-mt-28">
        <div
          className="border-2 border-secondary rounded-3xl p-6 md:p-8 space-y-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
          }}
        >
          <h2 className="font-mono font-bold text-themed text-xl">Figure 4</h2>
          <figure className="w-full border border-secondary overflow-hidden">
            <Image
              src={figure4}
              alt='Draft screen designs for the "You Can&apos;t Park There!" game.'
              className="w-full h-auto"
            />
            <figcaption className="px-3 py-2 text-[0.8rem] text-themed leading-snug">
              Figure 4. Draft screen designs for the &quot;You Can&apos;t Park
              There!&quot; game. Generated using ChatGPT (2026).
              <div className="mt-1">
                <a
                  href="#practice"
                  className="underline text-muted hover:text-secondary text-xs font-mono"
                >
                  Back to Practice ↑
                </a>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    
    </div>
  );
}

