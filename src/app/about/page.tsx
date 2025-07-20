"use client";
import React from "react";
import PageWrapper from "../components/PageWrapper";

const AboutPage = () => {
  return (
    <PageWrapper>
      <p className="text-lg leading-relaxed mb-6">
        Hi, I&apos;m Jimmy Nicholas. I&apos;m a software developer passionate about creating 
        beautiful, functional, and user-friendly applications.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        I specialize in modern web technologies including React, TypeScript, 
        and Next.js. I love experimenting with creative visual effects and 
        pushing the boundaries of what&apos;s possible on the web.
      </p>
      
      <p className="text-lg leading-relaxed">
        When I&apos;m not coding, you can find me exploring new technologies, 
        contributing to open source projects, or sharing my thoughts on 
        software development and design.
      </p>
    </PageWrapper>
  );
};

export default AboutPage; 