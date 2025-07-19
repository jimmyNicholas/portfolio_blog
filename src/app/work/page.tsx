"use client";
import React, { useState } from "react";
import Image from "next/image";
import useEffects from "../styleEffects/useEffects";

interface ProjectCard {
  id: string;
  title: string;
  url?: string;
  image: string;
  description: string;
  longDescription: string[];
  tech: string[];
  year: string;
}

const workProjects: ProjectCard[] = [
  {
    id: "portfolio-2024",
    title: "Portfolio with Vaporwave Effects",
    url: "jimmynicholas.dev",
    image: "/images/portfolio-preview.jpg",
    description:
      "A modern portfolio featuring experimental vaporwave visual effects.",
    longDescription: [
      "A modern portfolio site featuring experimental vaporwave visual effects using CSS filters, SVG noise generation, and custom React hooks.",
      "Includes business/creative mode toggle, chromatic aberration, film grain, halftone patterns, and CRT scanlines.",
      "Built with performance in mind using React 18 and modern CSS techniques.",
    ],
    tech: ["React", "TypeScript", "Next.js", "CSS Filters", "SVG"],
    year: "2024",
  },
  {
    id: "annoying-piano",
    title: "The Annoying Piano",
    url: "annoying-piano.vercel.app/",
    image: "/images/tidy-first-preview.jpg",
    description: "A piano that evolves as you play.",
    longDescription: [
      "A piano that evolves as you play.",
      "Has three modes - swap, gravity and move.",
      "Uses a dynamic state to question the fundamental truths of music",
    ],
    tech: ["React", "TypeScript", "Next.js", "Tone JS"],
    year: "2024",
  },
  {
    id: "music-theory-app",
    title: "Interactive Music Theory",
    url: "musictheory.jimmynicholas.dev",
    image: "/images/music-theory-preview.jpg",
    description:
      "Web app for learning music theory with interactive chord progressions.",
    longDescription: [
      "Web application for learning music theory with interactive chord progressions and scales.",
      "Features real-time audio playback, visual chord diagrams, and progress tracking.",
      "Designed for both beginners and advanced musicians looking to deepen their theory knowledge.",
    ],
    tech: ["React", "Web Audio API", "TonalJS", "Canvas"],
    year: "2023",
  },
  {
    id: "css-experiments",
    title: "CSS Animation Experiments",
    url: "codepen.io/jimmy-nicholas",
    image: "/images/css-experiments-preview.jpg",
    description: "Collection of creative CSS animations and visual effects.",
    longDescription: [
      "Collection of experimental CSS animations and visual effects exploring the boundaries of what's possible with modern CSS.",
      "Includes particle systems, morphing shapes, and interactive hover effects.",
      "All built without JavaScript, showcasing the power of CSS custom properties and transforms.",
    ],
    tech: ["CSS", "JavaScript", "HTML5", "Canvas"],
    year: "2022",
  },
  {
    id: "teaching-platform",
    title: "Online Teaching Platform",
    image: "/images/teaching-platform-preview.jpg",
    description:
      "Platform for creating and sharing interactive coding lessons.",
    longDescription: [
      "Full-stack platform for creating and sharing interactive coding lessons and tutorials.",
      "Features real-time code execution, progress tracking, and collaborative learning features.",
      "Built to help educators create engaging programming courses with minimal technical overhead.",
    ],
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    year: "2023",
  },
  {
    id: "vaporwave-generator",
    title: "Vaporwave Effect Generator",
    url: "vaporwave.jimmynicholas.dev",
    image: "/images/vaporwave-generator-preview.jpg",
    description: "Tool for generating retro visual effects on images.",
    longDescription: [
      "Browser-based tool for applying vaporwave and retro visual effects to images.",
      "Features real-time preview, customizable parameters, and high-quality output.",
      "Inspired by 80s aesthetics and VHS tape artifacts.",
    ],
    tech: ["Canvas API", "CSS Filters", "React", "WebGL"],
    year: "2024",
  },
];

const WorkPage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(
    null
  );

  const { palette } = useEffects();

  const openProjectDetails = (project: ProjectCard) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-12 px-8">
        <h1 className="text-4xl font-bold mb-16 text-center text-themed themed-filter">
          Work & Projects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {workProjects.map((project) => (
            <div key={project.id} className="group">
              {/* Project Image */}
              <div
                className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-xl overflow-hidden cursor-pointer mb-6 border-2 border-accent themed-filter transition-all duration-300 hover:themed-glow"
                onClick={() => openProjectDetails(project)}
              >
                {project.image ? (
                  <Image
                    width={600}
                    height={400}
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-themed opacity-50">
                      {project.title
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Link */}
              {project.url ? (
                <a
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-themed hover:text-accent transition-colors font-mono text-lg"
                >
                  {project.url}
                </a>
              ) : (
                <div className="text-center text-muted font-mono text-lg">
                  {project.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Overlay */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-8 z-50"
          onClick={closeProjectDetails}
        >
          <div
            className="max-w-4xl w-full rounded-2xl overflow-hidden relative"
            style={{
              backgroundColor: palette.background,
              border: `2px solid ${palette.accent}`,
              boxShadow: `0 0 40px ${palette.accent}60`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeProjectDetails}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-themed hover:text-accent transition-colors z-10"
              style={{ backgroundColor: palette.accent + "20" }}
            >
              ✕
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Project Image */}
              <div className="aspect-video lg:aspect-square">
                {selectedProject.image ? (
                  <Image
                    width={600}
                    height={600}
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                    <span className="text-6xl font-bold text-themed opacity-50">
                      {selectedProject.title
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="p-8 mr-2">
                <div className="flex flex-col justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-themed">
                    {selectedProject.title}
                  </h2>
                  <span className="text-sm text-muted font-mono">
                    {selectedProject.year}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedProject.longDescription.map((paragraph, index) => (
                    <p key={index} className="text-accent leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-themed mb-2">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="themed-tag px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkPage;
