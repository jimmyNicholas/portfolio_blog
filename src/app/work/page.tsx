"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useThemeContext } from "../components/ThemeProvider";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: "gamification-elearning",
    title: "Gamification in the Classroom",
    description: "A fully interactive eLearning module exploring the Caillois framework through hands-on game experiences. Built with xAPI tracking and LMS integration.",
    tags: ["Education", "Digital Teaching", "Code", "TypeScript", "React", "Next.js"],
    image: "/images/projects/gamification-classroom.png",
    link: "gamification-module-sepia.vercel.app",
  },
  {
    id: "gamification-proposal",
    title: "Gamification in the Classroom – Design Proposal",
    description: "A blended learning design proposal for Australian ELICOS teachers, covering needs analysis, audience personas, learning objectives, and curriculum design grounded in Action Mapping.",
    tags: ["Education", "Digital Teaching", "Action Mapping", "Bloom's Taxonomy"],
    image: "/images/projects/design-proposal.png",
    link: "jimmynicholas.com/work/gamification-proposal",
  },
  {
    id: "dining-facilities-at-work",
    title: "Dining Facilities at Work",
    description: "A quick Rise 360 course on dining facility compliance through interactive scenarios and quizzes.",
    tags: ["Education", "Digital Teaching", "RISE 360"],
    image: "/images/projects/dining-facilities.png",
    link: "jimmynicholas.com/work/dining-facilities-at-work",
  },
  {
    id: "story-buddy",
    title: "Story Buddy",
    description: "A collaborative AI storytelling tool that guides learners one sentence at a time.",
    tags: ["Education", "Digital Teaching", "AI", "Code"],
    image: "/images/projects/story-buddy.png",
    link: "jimmynicholas.com/work/story-buddy",
  },
  {
    id: "e-scooter-safety-course",
    title: "E-Scooter Safety Course",
    description: "A plan for a digital safety course for e-scooter riders.",
    tags: ["Education", "Digital Teaching"],
    image: "/images/projects/e-scooter_safety.png",
    link: "jimmynicholas.com/work/e-scooter-safety-course",
  },
  {
    id: "tone-clock",
    title: "Tone Clock",
    description: "A clock that uses the time to play the circle of fifths.",
    tags: ["Code", "Music", "React", "TypeScript", "Next.js", "Tone JS"],
    image: "/images/projects/tone-clock.png",
    link: "jimmynicholas.github.io/tone-clock",
  },
  {
    id: "annoying-piano",
    title: "The Annoying Piano",
    description: "A piano that evolves as you play.",
    tags: ["Code", "Music", "React", "TypeScript", "Next.js", "Tone JS"],
    image: "/images/projects/annoying-piano.png",
    link: "annoying-piano.vercel.app",
  },
  {
    id: "vocab-finder",
    title: "Vocab Finder",
    description: "A tool that helps ESL teachers quickly find information on lists of vocabulary words.",
    tags: ["Education", "Code", "JavaScript", "CSS", "HTML", "Figma"],
    image: "/images/projects/vocab-finder.png",
    link: "vocabfinder.jimmynicholas.com",
  },
];

// Tech abbreviations mapping
const techAbbreviations: Record<string, string> = {
  React: "React",
  TypeScript: "TS",
  "Next.js": "Next",
  CSS: "CSS",
  "SVG Filters": "SVG",
  "Node.js": "Node",
  "AST Parser": "AST",
  CLI: "CLI",
  JavaScript: "JS",
  "Canvas API": "Canvas",
  "Web Audio API": "Audio",
  "Game Dev": "Game",
  Sass: "Sass",
  Animation: "Anim",
  "Creative Coding": "Creative",
  "Terminal UI": "Term",
  AI: "AI",
  "Action Mapping": "Action Mapping",
  "Bloom's Taxonomy": "Bloom's Taxonomy",
};

type CategoryFilter = "all" | "code" | "music" | "education";
const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "code", label: "Code" },
  { value: "music", label: "Music" },
  { value: "education", label: "Education" },
];

const WorkPage = () => {
  const { isBusinessMode } = useThemeContext();
  const [category, setCategory] = useState<CategoryFilter>("all");

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'education' || hash === 'code' || hash === 'music') {
      setCategory(hash as CategoryFilter);
    }
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (category === "all") return true;
    return p.tags.some((t) => t.toLowerCase() === category);
  });

  const ProjectCard = ({ project }: { project: Project }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getCardStyle = () => ({
      backgroundColor: isHovered
        ? "var(--palette-background)"
        : "color-mix(in srgb, var(--palette-primary) 20%, var(--palette-background) 80%)",
      fontFamily: "monospace",
      boxShadow: isHovered
        ? "0 0 30px color-mix(in srgb, var(--palette-background) 80%, transparent)"
        : "0 0 20px color-mix(in srgb, var(--palette-primary) 20%, transparent)",
    });

    return (
      <a
        href={project.link ? `https://${project.link}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block ${!project.link ? "pointer-events-none" : ""}`}
      >
        <motion.div
          className={`relative border-2 border-secondary rounded-3xl transition-all duration-300 ${
            !isBusinessMode ? "crt-scanlines" : ""
          } p-6 flex flex-col cursor-pointer`}
          style={getCardStyle()}
          whileHover={{ scale: 1.01 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Title */}
          <h3 className="font-mono font-bold text-themed text-base mb-4">
            {project.title}
          </h3>

          {/* Image Frame with Hover Overlay */}
          <div className="relative h-[200px] mb-4 rounded-xl overflow-hidden bg-black border-2 border-[color:var(--palette-secondary)]">
            <div className="w-full h-full p-3">
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={200}
                className="w-full h-full object-contain transition-transform duration-300"
              />
            )}
            </div>

            {/* Dark Overlay with Description and Tags */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center p-4">
              <div className="opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-center">
                <p className="text-white mb-3 text-sm md:text-base font-mono">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tags Below Image */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-mono border border-primary text-themed"
              >
                {techAbbreviations[tag] || tag}
              </span>
            ))}
          </div>
        </motion.div>
      </a>
    );
  };

  const ProjectGrid = () => (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 border-2 p-8 rounded-3xl"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--palette-accent) 60%, var(--palette-background) 40%)",
      }}
    >
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );

  return (
    <motion.div
      className="max-w-8xl mx-auto px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-wrap gap-3 mb-6 w-full justify-center">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`px-4 py-2 rounded-full text-sm font-mono border transition-colors ${
              category === value
                ? "border-primary bg-[color:var(--palette-secondary)]/40 text-themed"
                : "border-primary text-themed hover:bg-[color:var(--palette-secondary)]/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ProjectGrid />
    </motion.div>
  );
};

export default WorkPage;
