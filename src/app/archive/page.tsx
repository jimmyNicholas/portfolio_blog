"use client";
import React from "react";
import PageWrapper from "../components/PageWrapper";

const ArchivePage = () => {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-themed">2024</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-accent pl-4">
            <h3 className="text-lg font-semibold text-themed">Portfolio Site with Vaporwave Effects</h3>
            <p className="text-sm text-muted">March 2024</p>
            <p className="mt-2">Experimental portfolio featuring creative visual effects and modern web technologies.</p>
          </div>
          <div className="border-l-4 border-accent pl-4">
            <h3 className="text-lg font-semibold text-themed">Tidy First: Code Refactoring Tool</h3>
            <p className="text-sm text-muted">February 2024</p>
            <p className="mt-2">Implementation of Kent Beck&apos;s refactoring methodology as an automated tool.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-themed">2023</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-accent pl-4">
            <h3 className="text-lg font-semibold text-themed">Early Experiments</h3>
            <p className="text-sm text-muted">Various dates</p>
            <p className="mt-2">Learning and experimenting with different technologies and approaches.</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-themed">Ongoing</h2>
        <p className="text-lg leading-relaxed">
          Continuously exploring new ideas, technologies, and creative approaches 
          to software development and design.
        </p>
      </div>
    </PageWrapper>
  );
};

export default ArchivePage; 