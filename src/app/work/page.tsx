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
    description: "Experimental portfolio featuring CRT scanlines, film grain, and chromatic aberration effects. Includes business/creative mode toggle with dynamic theme switching.",
    tags: ["React", "TypeScript", "Next.js", "CSS", "SVG Filters"],
    link: "github.com/jimmy/portfolio-vaporwave",
  },
  {
    id: "tidy-first-tool",
    title: "Tidy First: Code Refactoring Tool",
    description: "Implementation of Kent Beck's refactoring methodology as an automated tool. Focuses on small, safe transformations that preserve behavior.",
    tags: ["TypeScript", "Node.js", "AST Parser", "CLI"],
    link: "github.com/jimmy/tidy-first",
  },
  {
    id: "retro-game-engine",
    title: "Retro Game Engine",
    description: "A pixel-perfect game engine built for creating 8-bit style games. Features sprite management, collision detection, and sound synthesis.",
    tags: ["JavaScript", "Canvas API", "Web Audio API", "Game Dev"],
    link: "github.com/jimmy/retro-engine",
  },
  {
    id: "css-art-gallery",
    title: "CSS Art Gallery",
    description: "Collection of pure CSS artworks including geometric patterns, animated shapes, and experimental visual effects.",
    tags: ["CSS", "Sass", "Animation", "Creative Coding"],
    link: "css-art.jimmy.dev",
  },
  {
    id: "terminal-portfolio",
    title: "Terminal Portfolio",
    description: "Interactive terminal-style portfolio with command-line interface. Users can navigate and explore projects through terminal commands.",
    tags: ["React", "TypeScript", "Terminal UI", "CLI"],
    link: "terminal.jimmy.dev",
  },
  {
    id: "synthwave-player",
    title: "Synthwave Music Player",
    description: "Web-based music player with retro synthwave visualizer. Features waveform visualization and custom audio effects.",
    tags: ["Web Audio API", "Canvas", "JavaScript", "Audio"],
    link: "synthwave.jimmy.dev",
  }
];

// Tech abbreviations mapping
const techAbbreviations: Record<string, string> = {
  "React": "React",
  "TypeScript": "TS",
  "Next.js": "Next",
  "CSS": "CSS",
  "SVG Filters": "SVG",
  "Node.js": "Node",
  "AST Parser": "AST",
  "CLI": "CLI",
  "JavaScript": "JS",
  "Canvas API": "Canvas",
  "Web Audio API": "Audio",
  "Game Dev": "Game",
  "Sass": "Sass",
  "Animation": "Anim",
  "Creative Coding": "Creative",
  "Terminal UI": "Term"
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
        : "0 0 20px color-mix(in srgb, var(--palette-secondary) 20%, transparent)"
    });

    return (
            <motion.div
        className={`relative border-2 border-secondary rounded-3xl transition-all duration-300 ${
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
          {project.description.split('.')[0] + '.'}
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
            <div className="text-muted text-sm font-mono">
              Coming soon...
            </div>
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
        backgroundColor: "color-mix(in srgb, var(--palette-background) 30%, black 70%)"
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
