"use client";
import React from "react";
import PageWrapper from "../components/PageWrapper";

const AboutPage = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 bg-themed/80 py-4 rounded-xl text-lg leading-8">
        <p>
          Hey! I&apos;m Jimmy, and I&apos;m a developer, educator, and musician who likes exploring the intersections of code, sound, and culture.
        </p>
        <p>
          My path has taken unexpected turns—from teaching English in Japanese classrooms to building web tools in Melbourne caf&eacute;s. Each experience revealed the same truth: technology becomes meaningful when it helps someone else succeed. This belief shapes how I approach every project, always asking: who does this help, and how can it help them better?
        </p>
        <p>
          While teaching English at Impact English College, I&apos;ve been quietly developing solutions that bridge education and technology. Vocab Finder streamlines lesson planning by instantly pulling definitions, examples, and usage notes for entire vocabulary lists—a small tool that saves teachers from late-night dictionary diving. I&apos;ve also been building a student record database that builds on their paper-based system. What started as a way to reduce admin has evolved into something that makes it easier to support my students and work with my colleagues.
        </p>
        <p>
          Music has been the constant thread through all these chapters. With a degree in music performance (bass) and honours (beat making), I&apos;ve toured across Australia and Japan, played everywhere from jazz clubs to art festivals, and released multiple cassettes that document these journeys. Although I&apos;m not performing as much these days, my love of music has influenced my coding journey with projects like a piano that evolves as you play and a clock that plays the circle of fifths using the time.
        </p>
        <p>
          These days, I&apos;m most interested in projects that blend technical craft with genuine helpfulness (and a tinge of chaos). The tools that excite me aren&apos;t the flashiest ones—they&apos;re the ones that quietly make someone&apos;s day a little easier or their creative process a little more joyful.
        </p>
        <p>
          Based in Melbourne, where the coffee is strong and the sunsets are worth sampling.
        </p>
      </div>
    </PageWrapper>
  );
};

export default AboutPage; 