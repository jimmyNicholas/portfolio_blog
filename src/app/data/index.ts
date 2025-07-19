export type ContentSection = 'work' | 'about' | 'thoughts' | 'archive';

export interface BaseContentItem {
  id: string;
  title: string;
  content: string[];
}

export interface PostItem extends BaseContentItem {
  type: 'post';
  date: string;
  tags?: string[];
}

export interface ProjectItem extends BaseContentItem {
  type: 'project';
  tech?: string[];
  status?: 'active' | 'archived' | 'completed';
  link?: string;
}

export interface BioItem extends BaseContentItem {
  type: 'bio';
}

export type ContentItem = PostItem | ProjectItem | BioItem;

// === WORK SECTION ===
export const workContent: ContentItem[] = [
  {
    id: 'portfolio-2024',
    type: 'project',
    title: 'Portfolio Site with Vaporwave Effects',
    tech: ['React', 'TypeScript', 'Next.js', 'CSS', 'SVG Filters'],
    status: 'active',
    content: [
      'A modern portfolio site featuring experimental vaporwave visual effects using CSS filters, SVG noise generation, and custom React hooks.',
      'Includes business/creative mode toggle, chromatic aberration, film grain, halftone patterns, and CRT scanlines.'
    ]
  },
  {
    id: 'tidy-first-implementation',
    type: 'project',
    title: 'Tidy First: Code Refactoring Tool',
    tech: ['TypeScript', 'Node.js', 'AST Parser'],
    status: 'active',
    content: [
      'Implementation of Kent Beck\'s "Tidy First" methodology as an automated refactoring tool.',
      'Focuses on small, safe transformations that preserve behavior while improving code readability.'
    ]
  }
];

// === ABOUT SECTION ===
export const aboutContent: ContentItem[] = [
  {
    id: 'bio',
    type: 'bio',
    title: 'About Me',
    content: [
      'Hi, I\'m Jimmy Nicholas. I\'m passionate about the intersection of music, teaching, and code.',
      'As a developer, I believe in clean, maintainable code and the principles of incremental improvement. Kent Beck\'s "Tidy First" approach resonates deeply with how I think about both software and life.',
      'In music, I find the same patterns and structures that appear in programming - scales, progressions, and rhythms that create something beautiful and meaningful.',
      'Through teaching, I\'ve learned that the best way to truly understand something is to help others discover it for themselves.'
    ]
  }
];

// === THOUGHTS SECTION ===
export const thoughtsContent: ContentItem[] = [
  {
    id: 'tidy-first-thoughts',
    type: 'post',
    title: 'Getting Started with Tidy First',
    date: '2024-01-15',
    tags: ['software design', 'kent beck', 'refactoring'],
    content: [
      'Software design is about making decisions that preserve optionality while delivering value.',
      'Kent Beck\'s approach to incremental improvement resonates with how I think about both code and music.',
      'Small, deliberate changes compound over time to create something meaningful.'
    ]
  },
  {
    id: 'music-and-code',
    type: 'post',
    title: 'Patterns in Music and Programming',
    date: '2024-01-10',
    tags: ['music', 'programming', 'patterns'],
    content: [
      'Both music and programming are about patterns, structure, and expression. In music, we have scales, chord progressions, and rhythmic patterns.',
      'In code, we have design patterns, algorithms, and architectural structures. The discipline required for both is remarkably similar.',
      'The best musicians and programmers understand that creativity comes from mastering fundamentals, then finding new ways to combine them.'
    ]
  }
];

// === ARCHIVE SECTION ===
export const archiveContent: ContentItem[] = [
  {
    id: 'early-experiments',
    type: 'project',
    title: 'Early CSS Animation Experiments',
    tech: ['CSS', 'JavaScript', 'HTML5'],
    status: 'archived',
    content: [
      'Collection of experimental CSS animations and visual effects from 2020-2022.',
      'Exploration of transform matrices, keyframe animations, and creative use of CSS properties.'
    ]
  }
];

// === MAIN DATA EXPORT ===
export const contentData = {
  work: workContent,
  about: aboutContent,
  thoughts: thoughtsContent,
  archive: archiveContent
};

export const getContentForSection = (section: ContentSection): ContentItem[] => {
  return contentData[section] || [];
};