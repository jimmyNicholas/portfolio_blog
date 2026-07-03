"use client";

import Image from "next/image";
import { useCallback, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselImage = {
  src: string;
  label: string;
};

export const caseStudyImageFrameClass =
  "relative aspect-video w-full rounded-lg overflow-hidden border border-themed bg-alt";

type CaseStudyCarouselProps = {
  images: CarouselImage[];
};

export default function CaseStudyCarousel({ images }: CaseStudyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
      }
    },
    [images.length],
  );

  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  const current = images[currentIndex];

  return (
    <div
      className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)] rounded-lg"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`Image carousel: ${current.label}`}
      aria-roledescription="carousel"
    >
      <div className={caseStudyImageFrameClass}>
        <Image
          src={current.src}
          alt={current.label}
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          className="object-contain"
        />

        <button
          type="button"
          onClick={prev}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full border border-themed bg-[color-mix(in_srgb,var(--palette-background)_80%,transparent)] text-themed hover:bg-[color-mix(in_srgb,var(--palette-background)_95%,transparent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={next}
          disabled={currentIndex === images.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full border border-themed bg-[color-mix(in_srgb,var(--palette-background)_80%,transparent)] text-themed hover:bg-[color-mix(in_srgb,var(--palette-background)_95%,transparent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <p
        className="text-center font-mono text-sm text-muted"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentIndex + 1} of {images.length}
      </p>

      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {images.map((image, index) => (
          <button
            key={image.label}
            type="button"
            onClick={() => goTo(index)}
            className={`shrink-0 w-20 aspect-video rounded overflow-hidden border-2 transition-colors ${
              index === currentIndex ? "border-themed" : "border-transparent"
            }`}
            aria-label={`View ${image.label}`}
            aria-current={index === currentIndex ? "true" : undefined}
          >
            <div className="relative w-full h-full bg-alt">
              <Image
                src={image.src}
                alt=""
                fill
                sizes="80px"
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
