import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CaseStudyCarousel, {
  caseStudyImageFrameClass,
} from "../../components/CaseStudyCarousel";

export const metadata: Metadata = {
  title: "Gamification in the Classroom | Jimmy Nicholas",
  description:
    "Designed a custom diagnostic tool that guides teachers through game-type selection, built in Next.js when the recommended platform could not support the interaction.",
};

const tags = ["Next.js", "xAPI", "ELICOS", "Action Mapping"];

const problems = [
  {
    number: "01",
    title: "Sector gap",
    body: "Zero gamification sessions found across 9 English Australia PD Fest programs (2023–25), against roughly 35–40 AI sessions. No practical sector-specific framework existed.",
  },
  {
    number: "02",
    title: "Platform limit",
    body: "Rise 360 could not support a progressively revealed two-axis diagnostic grid. The design led the tool decision — a custom Next.js build with xAPI tracking was made instead.",
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Landing",
    rationale:
      "Learners are shown what the course will teach and why it matters before any theory is introduced.",
    image: (
      <div className={caseStudyImageFrameClass}>
        <Image
          src="/images/gamification/landing page.png"
          alt="Landing"
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          className="object-contain"
        />
      </div>
    ),
  },
  {
    number: "02",
    title: "Play",
    rationale:
      "All four game types are experienced first. Framework vocabulary is introduced after, not before.",
    image: (
      <CaseStudyCarousel
        images={[
          { src: "/images/gamification/comp_1.png", label: "Competition" },
          { src: "/images/gamification/chance_1.png", label: "Chance" },
          { src: "/images/gamification/roleplay_1.png", label: "Roleplay" },
          { src: "/images/gamification/chaos_1.png", label: "Chaos" },
        ]}
      />
    ),
  },
  {
    number: "03",
    title: "Build",
    rationale:
      "Learners match, sort, and categorise the games they just played. Understanding is constructed through doing before any explicit framework is named.",
    image: (
      <CaseStudyCarousel
        images={[
          { src: "/images/gamification/match_1.png", label: "Match" },
          { src: "/images/gamification/match_2.png", label: "Match 2" },
          { src: "/images/gamification/flip_1.png", label: "Flip" },
          { src: "/images/gamification/sort_1.png", label: "Sort" },
          { src: "/images/gamification/sort_2.png", label: "Sort 2" },
        ]}
      />
    ),
  },
  {
    number: "04",
    title: "Diagnose",
    rationale:
      "The two-axis framework is revealed progressively across multiple screens. Learners build the grid before using it.",
    image: (
      <CaseStudyCarousel
        images={[
          { src: "/images/gamification/axis_1.png", label: "Axis introduced" },
          { src: "/images/gamification/axis_2.png", label: "Agency and Fate" },
          { src: "/images/gamification/axis_3.png", label: "Full grid" },
        ]}
      />
    ),
  },
  {
    number: "05",
    title: "Assess",
    rationale:
      "Learners place real classroom situations on the diagnostic grid and receive a consequence narrative and a suggested alternative.",
    image: (
      <CaseStudyCarousel
        images={[
          { src: "/images/gamification/assessment_1.png", label: "Place your answer" },
          {
            src: "/images/gamification/assessment_2.png",
            label: "Your choice and alternative",
          },
        ]}
      />
    ),
  },
  {
    number: "06",
    title: "Measure",
    rationale:
      "xAPI statements are captured throughout the session. Session duration, phases visited, answers given, and raw JSON are available for LMS integration.",
    image: (
      <div className={caseStudyImageFrameClass}>
        <Image
          src="/images/gamification/xAPI integration.png"
          alt="Measure"
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          className="object-contain"
        />
      </div>
    ),
  },
];

const outcomes = [
  { score: 100, label: "Rise Module" },
  { score: 100, label: "Custom Activity" },
  { score: 95, label: "Storyboard" },
  { score: 95, label: "Presentation" },
  { score: 89, label: "Design Proposal" },
  { score: 84, label: "Online Workshop" },
];

function SectionDivider() {
  return <hr className="border-t border-themed" />;
}

export default function GamificationPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 md:px-8 space-y-8">
      {/* 1. Header */}
      <header className="space-y-3">
        <p className="font-mono text-sm text-accent">Education · Learning Design</p>
        <h1 className="font-mono font-bold text-themed text-2xl md:text-3xl">
          Gamification in the Classroom
        </h1>
        <p className="font-mono text-primary text-sm md:text-base">
          Learning Designer and Developer · Solo project
        </p>
        <p className="text-accent leading-relaxed">
          Designed a custom diagnostic tool that guides teachers through game-type
          selection, built in Next.js when the recommended platform could not support
          the interaction.
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

      {/* 2. The problems */}
      <section className="space-y-4">
        <h2 className="font-mono font-bold text-themed text-xl">The problems</h2>
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

      <SectionDivider />

      {/* 3. The learning journey */}
      <section className="space-y-8">
        <h2 className="font-mono font-bold text-themed text-xl">The learning journey</h2>
        <ol className="space-y-8">
          {journeySteps.map((step) => (
            <li key={step.number} className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-themed font-mono text-xs text-muted shrink-0 mt-0.5">
                  {step.number}
                </span>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-mono font-bold text-themed text-sm md:text-base">
                    {step.title}
                  </h3>
                  <p className="text-accent text-sm leading-relaxed">{step.rationale}</p>
                </div>
              </div>
              <div className="pl-10">{step.image}</div>
            </li>
          ))}
        </ol>
      </section>

      <SectionDivider />

      {/* 4. Outcomes */}
      <section className="space-y-4">
        <h2 className="font-mono font-bold text-themed text-xl">Outcomes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

      <SectionDivider />

      {/* 5. Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        <a
          href="https://gamification-module-sepia.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-2xl border-2 border-primary text-center font-mono text-themed hover:bg-[color:var(--palette-primary)]/10 transition-colors"
        >
          View interactive module
        </a>
        <Link
          href="/work/gamification-proposal"
          className="block p-4 rounded-2xl border-2 border-primary text-center font-mono text-themed hover:bg-[color:var(--palette-primary)]/10 transition-colors"
        >
          Design proposal
        </Link>
      </section>
    </article>
  );
}
