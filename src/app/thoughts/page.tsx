"use client";
import React from "react";
import PageWrapper from "../components/PageWrapper";

const ThoughtsPage = () => {
  return (
    <PageWrapper>
      <article className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-themed">
          The Art of Code Refactoring
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          Refactoring is not just about cleaning up code—it&apos;s about making 
          it more readable, maintainable, and expressive. Every small 
          improvement compounds over time.
        </p>
        <div className="flex gap-2">
          <span className="themed-tag px-2 py-1 rounded text-xs">Refactoring</span>
          <span className="themed-tag px-2 py-1 rounded text-xs">Code Quality</span>
        </div>
      </article>
      
      <article className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-themed">
          Visual Effects in Web Development
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          The web is a canvas for creativity. CSS filters, SVG effects, and 
          JavaScript animations can transform a functional interface into 
          an engaging experience.
        </p>
        <div className="flex gap-2">
          <span className="themed-tag px-2 py-1 rounded text-xs">CSS</span>
          <span className="themed-tag px-2 py-1 rounded text-xs">Animation</span>
        </div>
      </article>
      
      <article>
        <h2 className="text-2xl font-bold mb-4 text-themed">
          The Future of Frontend Development
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          As frameworks evolve and new tools emerge, the core principles 
          of good design and user experience remain constant. The best 
          interfaces are those that feel intuitive and delightful.
        </p>
        <div className="flex gap-2">
          <span className="themed-tag px-2 py-1 rounded text-xs">UX</span>
          <span className="themed-tag px-2 py-1 rounded text-xs">Design</span>
        </div>
      </article>
    </PageWrapper>
  );
};

export default ThoughtsPage; 