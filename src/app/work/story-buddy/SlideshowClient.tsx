"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/images/story-buddy/1_Story-Buddy.png", alt: "Story Buddy" },
  { src: "/images/story-buddy/2_Concept-Timeline.png", alt: "Concept Timeline" },
  { src: "/images/story-buddy/3_Audiences.png", alt: "Audiences" },
  { src: "/images/story-buddy/4_User-Testing.png", alt: "User Testing" },
  { src: "/images/story-buddy/5_Iteration.png", alt: "Iteration: Onboarding" },
  { src: "/images/story-buddy/6_Iteration.png", alt: "Iteration: Language Filter" },
  { src: "/images/story-buddy/7_.png", alt: "UX Laws: Hick's Law" },
  { src: "/images/story-buddy/8_.png", alt: "UX Laws: Miller's Law" },
  { src: "/images/story-buddy/9_Freytags-Pyramid.png", alt: "Freytag's Pyramid" },
  { src: "/images/story-buddy/10_Under-the-Hood.png", alt: "Under the Hood" },
  { src: "/images/story-buddy/11_Demo.png", alt: "Demo" },
  { src: "/images/story-buddy/12_A-complete-story-every-time.png", alt: "Complete Story" },
  { src: "/images/story-buddy/13_Further-Development.png", alt: "Further Development" },
  { src: "/images/story-buddy/14_References.png", alt: "References" },
  { src: "/images/story-buddy/15_Thank-You.png", alt: "Thank You" },
];

export default function SlideshowClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div
      className="border-2 border-secondary rounded-3xl p-6 md:p-8"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
      }}
    >
      {/* Slideshow Container */}
      <div className="relative w-full">
        {/* Slide Counter */}
        <div className="absolute top-4 right-4 z-10 bg-black/70 px-3 py-1 rounded-full">
          <span className="text-white font-mono text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        {/* Image Frame */}
        <div className="relative h-[300px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden bg-black border-2 border-secondary">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 p-4"
            >
              <Image
                src={slides[currentSlide].src}
                alt={slides[currentSlide].alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </motion.div>
          </AnimatePresence>

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed p-2 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed p-2 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[color:var(--palette-primary)] scale-125"
                  : "bg-[color:var(--palette-secondary)] hover:bg-[color:var(--palette-accent)]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
