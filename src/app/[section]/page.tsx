import { notFound } from 'next/navigation';

interface SectionPageProps {
  params: {
    section: string;
  };
}

const validSections = ['about', 'thoughts', 'archive'] as const;

const SectionPage = async ({ params }: SectionPageProps) => {
  const { section } = await params;
  
  // Work has its own dedicated page now
  if (section === 'work') {
    notFound();
  }
  
  if (!validSections.includes(section as typeof validSections[number])) {
    notFound();
  }

  // Return simple content for other sections for now
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-themed themed-filter">
        {section.charAt(0).toUpperCase() + section.slice(1)}
      </h1>
      <p className="text-accent">
        {section} content coming soon...
      </p>
    </div>
  );
};

export default SectionPage;

export function generateStaticParams() {
  return [
    { section: 'about' },
    { section: 'thoughts' },
    { section: 'archive' },
  ];
}