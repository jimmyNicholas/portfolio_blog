"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useThemeContext } from "../components/ThemeProvider";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

const projects: Project[] = [
  {
    id: "portfolio-vaporwave",
    title: "Portfolio Site with Vaporwave Effects",
    description:
      "Experimental portfolio featuring CRT scanlines, film grain, and chromatic aberration effects. Includes business/creative mode toggle with dynamic theme switching.",
    tags: ["React", "TypeScript", "Next.js", "CSS", "SVG Filters"],
    link: "https://jimmynicholas.com",
  },
  {
    id: "tone-clock",
    title: "Tone Clock",
    description: "A clock that uses the time to play the circle of fifths.",
    tags: ["React", "TypeScript", "Next.js", "Tone JS"],
    link: "https://jimmynicholas.github.io/tone-clock/",
  },
  {
    id: "impact-db",
    title: "Impact DB",
    description:
      "A full-stack database that extends Impact English College's paper-based system.",
    tags: ["TypeScript", "React", "Django"],
    link: "https://github.com/jimmyNicholas/impact_db",
  },
  {
    id: "annoying-piano",
    title: "The Annoying Piano",
    description: "A piano that evolves as you play.",
    tags: ["React", "TypeScript", "Next.js", "Tone JS"],
    link: "annoying-piano.vercel.app/",
  },
  {
    id: "vocab-finder",
    title: "Vocab Finder",
    description:
      "A tool that helps ESL teachers quickly find information on lists of vocabulary words ",
    tags: ["JavaScript", "CSS", "HTML", "Figma"],
    link: "https://vocabfinder.jimmynicholas.com",
  },
  {
    id: "sunsets",
    title: "Sunsets",
    description: "A collection of hip hop beats based on sunsets.",
    tags: ["Ableton", "cassettes", "sampling", "collaboration"],
    link: "https://lashlash.bandcamp.com/album/sunsets",
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
};

const WorkPage = () => {
  const { isBusinessMode } = useThemeContext();

  const ProjectCard = ({ project }: { project: Project }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getCardStyle = () => ({
      backgroundColor: isHovered
        ? "color-mix(in srgb, var(--palette-secondary) 20%, var(--palette-background) 80%)"
        : "var(--palette-background)",
      fontFamily: "monospace",
      boxShadow: isHovered
        ? "0 0 30px color-mix(in srgb, var(--palette-primary) 80%, transparent)"
        : "0 0 20px color-mix(in srgb, var(--palette-secondary) 20%, transparent)",
    });

    return (
      <motion.div
        className={`relative border-2 border-secondary rounded-3xl transition-all duration-300 min-h-[290px] ${
          !isBusinessMode ? "crt-scanlines" : ""
        } p-6 h-64 flex flex-col`}
        style={getCardStyle()}
        whileHover={{ scale: 1.01 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Title */}
          <div className="font-mono font-bold text-themed text-base">
            {project.title}
          </div>

          {/* Description */}
          <div className="text-accent text-sm leading-relaxed flex-1">
            {project.description.split(".")[0] + "."}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-mono border border-primary text-accent"
              >
                {techAbbreviations[tag] || tag}
              </span>
            ))}
          </div>

          {/* Link */}
          <div className="mt-auto">
            {project.link ? (
              <a
                href={`https://${project.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm hover:text-secondary transition-colors font-mono"
              >
                {project.link}
              </a>
            ) : (
              <div className="text-muted text-sm font-mono">Coming soon...</div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const ProjectGrid = () => (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-2 p-8 rounded-3xl"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--palette-background) 30%, black 70%)",
      }}
    >
      {projects.map((project) => (
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
      <ProjectGrid />
    </motion.div>
  );
};

export default WorkPage;
