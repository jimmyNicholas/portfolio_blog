import React from 'react';

const HomePage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">About Me</h1>
      <div className="space-y-6">
        <p className="text-gray-800 leading-relaxed">
          Hi, I&apos;m Jimmy Nicholas. I&apos;m passionate about the intersection of music, teaching, and code.
        </p>
        <p className="text-gray-800 leading-relaxed">
          As a developer, I believe in clean, maintainable code and the principles of incremental improvement. 
          Kent Beck&apos;s &quot;Tidy First&quot; approach resonates deeply with how I think about both software and life.
        </p>
        <p className="text-gray-800 leading-relaxed">
          In music, I find the same patterns and structures that appear in programming - scales, progressions, 
          and rhythms that create something beautiful and meaningful.
        </p>
        <p className="text-gray-800 leading-relaxed">
          Through teaching, I&apos;ve learned that the best way to truly understand something is to help others 
          discover it for themselves.
        </p>
      </div>
    </div>
  );
};

export default HomePage;