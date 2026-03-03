"use client";
import React from "react";
import PageWrapper from "../components/PageWrapper";

const AboutPage = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 bg-themed/80 py-4 rounded-xl text-lg leading-8">
        <p>
          Hey! I&apos;m Jimmy, and I&apos;m an educator, digital learning designer, developer, and musician who likes exploring the boundaries of code,
          sound, and culture.
        </p>
        <p>
          My path has taken unexpected turns, from teaching English in Japanese classrooms to building web tools in Melbourne caf&eacute;s. Each
          experience revealed the same truth: technology becomes meaningful when it helps someone else succeed. This belief shapes how I approach
          every project, always asking: who does this help, and how can it help them better?
        </p>
        <p>
          While teaching, I&apos;ve been quietly working on projects that combine my three passions: education, music, and technology—building creative
          things that blend technical craft with kindness (and a tinge of chaos).
        </p>
        <p>
          Music has been the constant thread through all these chapters. With a degree in music performance (bass) and honours (beat making), I&apos;ve
          toured across Australia and Japan, played everywhere from jazz clubs to art festivals, and released multiple cassettes that document these
          journeys.
        </p>
        <p>Based in Melbourne, where the coffee is strong and the sunsets are worth sampling.</p>
      </div>
    </PageWrapper>
  );
};

export default AboutPage; 