export interface BlogPost {
  id: string;
  title: string;
  date: string;
  section: 'music' | 'teaching' | 'code';
  tags: string[];
  paragraphs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Tidy First',
    date: '2024-01-15',
    section: 'code',
    tags: ['software design', 'kent beck', 'refactoring'],
    paragraphs: [
      'Software design is about making decisions that preserve optionality while delivering value.',
      'Kent Beck\'s approach to incremental improvement resonates with how I think about both code and music.',
      'Small, deliberate changes compound over time to create something meaningful.'
    ]
  },
  {
    id: '2',
    title: 'The Intersection of Music and Code',
    date: '2024-01-10',
    section: 'music',
    tags: ['patterns', 'structure', 'creativity'],
    paragraphs: [
      'Both music and programming are about patterns, structure, and expression.',
      'In music, we have scales, chord progressions, and rhythmic patterns.',
      'In code, we have design patterns, algorithms, and architectural structures.',
      'The discipline required for both is remarkably similar.'
    ]
  },
  {
    id: '3',
    title: 'Teaching Through Discovery',
    date: '2024-01-05',
    section: 'teaching',
    tags: ['pedagogy', 'discovery learning', 'student engagement'],
    paragraphs: [
      'The best learning happens when students discover concepts for themselves.',
      'As educators, our role is to create the conditions for discovery.',
      'This means asking the right questions rather than providing all the answers.'
    ]
  }
];