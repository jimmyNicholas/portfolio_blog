import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CaseStudyCarousel, {
  caseStudyImageFrameClass,
} from "../../components/CaseStudyCarousel";

export const metadata: Metadata = {
  title: "Generating Silence | Jimmy Nicholas",
  description:
    "Designed a three-session blended course on experimental music and AI prompting for tertiary students, building a reusable tool system and visual design language before writing a single line of course content.",
};

const tags = ["Moodle", "Brightspace", "Blended Learning", "xAPI", "HTML/CSS"];

const problems = [
  {
    number: "01",
    title: "Subject matter",
    body: "A three-session blended course for third-year undergraduate students in music performance and composition. No prior AI experience assumed. The challenge was making unfamiliar subject matter feel navigable and purposeful.",
  },
  {
    number: "02",
    title: "Platform constraint",
    body: "Built in Brightspace and transferred to Moodle. Systematic testing revealed where native platform features would fall short before a single content page was written.",
  },
];

const contentSections = [
  {
    number: "01",
    title: "Test first",
    rationale:
      "Before building anything, Brightspace's capabilities and limitations were mapped through systematic testing. The style guide and colour palette came directly out of this phase, a design system built upfront so that implementation would be efficient and consistent.",
    image: (
      <div className={caseStudyImageFrameClass}>
        <Image
          src="/images/generating-silence/testing-LMS.png"
          alt="LMS capability testing"
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          className="object-contain"
        />
      </div>
    ),
  },
  {
    number: "02",
    title: "Design system",
    rationale:
      "A full colour palette with five distinct themes, each mapped to a composer or role with a personality descriptor. Typography, layout components, callouts, navigation, and embeds all defined upfront so every page felt consistent and intentional rather than default.",
    image: (
      <CaseStudyCarousel
        images={[
          {
            src: "/images/generating-silence/colour_palette.png",
            label: "Colour palette",
          },
          {
            src: "/images/generating-silence/style_guide.png",
            label: "Style guide",
          },
        ]}
      />
    ),
  },
  {
    number: "04",
    title: "Custom tools",
    rationale:
      "Two platform gaps solved with custom solutions. Navigation was rebuilt using HTML in the description area to keep learners in the learning moment. The checklist tool uses URL parameters so it was designed not for one checklist but for all future ones. Hard work now, easy work later.",
    image: (
      <CaseStudyCarousel
        images={[
          {
            src: "/images/generating-silence/session_2_checklist.png",
            label: "Checklist in use",
          },
          {
            src: "/images/generating-silence/Checklist_tool.png",
            label: "Checklist builder",
          }
        ]}
      />
    ),
  },
];

const courseSessions = [
  {
    number: "01",
    title: "In-person: encounter the tradition",
    rationale:
      "Highly scaffolded. Learners encounter Cage, Young, and Higgins through primary sources and physical card sorting activities before any framework is named. They leave with a draft intent statement and a first attempt at their own event score.",
    image: (
      <CaseStudyCarousel
        images={[
          {
            src: "/images/generating-silence/session_1_outline.png",
            label: "Session outline",
          },
          {
            src: "/images/generating-silence/danger-music-activity.png",
            label: "Danger Music card sort",
          },
          {
            src: "/images/generating-silence/creating_event_scores.png",
            label: "Creating event scores",
          },
        ]}
      />
    ),
  },
  {
    number: "02",
    title: "Synchronous online: run the loop",
    rationale:
      "Scaffolding reduces. Learners translate their intent into a first AI prompt, experience failure, and iterate. The loop (Event Score, Prompt, Result, Analyse, Adjust) is both the session structure and the assignment method.",
    image: (
      <CaseStudyCarousel
        images={[
          {
            src: "/images/generating-silence/session_2_outline.png",
            label: "Session outline",
          },
          {
            src: "/images/generating-silence/Online_Synch_Session.png",
            label: "Iteration loop",
          },
        ]}
      />
    ),
  },
  {
    number: "03",
    title: "Asynchronous: independent iteration",
    rationale:
      "Scaffolding removed. Learners work independently through the resource bank, document milestone prompts with reasoning, and reflect on what the gap between their intent and the AI output reveals about their own practice.",
    image: (
      <div className={caseStudyImageFrameClass}>
        <Image
          src="/images/generating-silence/session_3_overview_IQ.png"
          alt="Session 3 overview"
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          className="object-contain"
        />
      </div>
    ),
  },
];

const outcomes = [
  { score: 92.5, label: "Curriculum Design" },
  { score: 94, label: "Course Realisation" },
];

const artefacts = [
  {
    label: "Curriculum Design",
    title: "Design Document",
    href: "/work/generating-silence/curriculum-design",
  },
  {
    label: "Session 1",
    title: "Slides and Activities",
    href: "/work/generating-silence/session-1-slides",
  },
  {
    label: "Physical Resources",
    title: "Danger Music Cards",
    href: "/work/generating-silence/danger-cards",
  },
  {
    label: "Physical Resources",
    title: "Session Worksheet",
    href: "/work/generating-silence/worksheet",
  },
];

function SectionDivider() {
  return <hr className="border-t border-themed" />;
}

export default function GeneratingSilencePage() {
  return (
    <article className="max-w-2xl mx-auto px-4 md:px-8 space-y-8">
      {/* 1. Header */}
      <header className="space-y-3">
        <p className="font-mono text-sm text-accent">
          Education · Blended Learning · LMS Design
        </p>
        <h1 className="font-mono font-bold text-themed text-2xl md:text-3xl">
          Generating Silence
        </h1>
        <p className="font-mono text-primary text-sm md:text-base">
          Learning Designer and Developer · VU Capstone Project
        </p>
        <p className="text-accent leading-relaxed">
          Designed a three-session blended course on experimental music and AI
          prompting for tertiary students, building a reusable tool system and
          visual design language before writing a single line of course content.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <span key={tag} className="themed-tag rounded-full px-2.5 py-0.5 text-xs font-mono">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <SectionDivider />

      {/* 2. The brief */}
      <section className="space-y-4">
        <h2 className="font-mono font-bold text-themed text-xl">The brief</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {problems.map((problem) => (
            <div
              key={problem.number}
              className="flex-1 border border-themed rounded-2xl p-4 md:p-5 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-themed font-mono text-xs text-muted shrink-0">
                  {problem.number}
                </span>
                <h3 className="font-mono font-bold text-themed text-sm md:text-base">
                  {problem.title}
                </h3>
              </div>
              <p className="text-themed text-sm leading-relaxed">{problem.body}</p>
            </div>
          ))}
        </div>
      </section>

      {contentSections.slice(0, 2).map((section) => (
        <div key={section.number}>
          <SectionDivider />
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-themed font-mono text-xs text-muted shrink-0 mt-0.5">
                {section.number}
              </span>
              <div className="space-y-1 min-w-0">
                <h2 className="font-mono font-bold text-themed text-xl">{section.title}</h2>
                <p className="text-accent text-sm leading-relaxed">{section.rationale}</p>
              </div>
            </div>
            <div className="pl-10">{section.image}</div>
          </section>
        </div>
      ))}

      <SectionDivider />

      <section className="space-y-8">
        <div className="space-y-1">
          <p className="font-mono text-sm text-accent">Scaffolding arc</p>
          <h2 className="font-mono font-bold text-themed text-xl">The course</h2>
        </div>
        <ol className="space-y-8">
          {courseSessions.map((session) => (
            <li key={session.number} className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-themed font-mono text-xs text-muted shrink-0 mt-0.5">
                  {session.number}
                </span>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-mono font-bold text-themed text-sm md:text-base">
                    {session.title}
                  </h3>
                  <p className="text-accent text-sm leading-relaxed">{session.rationale}</p>
                </div>
              </div>
              <div className="pl-10">{session.image}</div>
            </li>
          ))}
        </ol>
      </section>

      {contentSections.slice(2).map((section) => (
        <div key={section.number}>
          <SectionDivider />
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-themed font-mono text-xs text-muted shrink-0 mt-0.5">
                {section.number}
              </span>
              <div className="space-y-1 min-w-0">
                <h2 className="font-mono font-bold text-themed text-xl">{section.title}</h2>
                <p className="text-accent text-sm leading-relaxed">{section.rationale}</p>
              </div>
            </div>
            <div className="pl-10">{section.image}</div>
          </section>
        </div>
      ))}

      <SectionDivider />

      {/* Outcomes */}
      <section className="space-y-4">
        <h2 className="font-mono font-bold text-themed text-xl">Outcomes and Deliverables</h2>
        <a
          href="https://moodle.jimmynicholas.com/course/section.php?id=1"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-themed rounded-xl p-4 hover:bg-alt transition-colors text-center"
        >
          <p className="text-xs text-muted">Live Course</p>
          <p className="text-sm font-medium text-themed">View Generating Silence on Moodle</p>
        </a>
        <div className="grid grid-cols-2 gap-3">
          {artefacts.map((artefact) => (
            <Link
              key={artefact.href}
              href={artefact.href}
              className="block border border-themed rounded-xl p-4 hover:bg-alt transition-colors"
            >
              <p className="text-xs text-muted">{artefact.label}</p>
              <p className="text-sm font-medium text-themed">{artefact.title}</p>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {outcomes.map((outcome) => (
            <div
              key={outcome.label}
              className="flex flex-col items-center gap-1 rounded-xl border border-[color:var(--palette-success)]/40 bg-[color:var(--palette-success)]/15 p-4"
            >
              <span className="text-2xl font-bold text-success">{outcome.score}%</span>
              <span className="text-xs text-muted">{outcome.label}</span>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
