import { ContentWindow } from '../components/ContentWindow';
import { getContentForSection, ContentSection } from '../data';
import { notFound } from 'next/navigation';

interface SectionPageProps {
  params: {
    section: string;
  };
}

const validSections = ['work', 'about', 'thoughts', 'archive'] as const;

const SectionPage = async ({ params }: SectionPageProps) => {
  const { section } = await params;
  
  if (!validSections.includes(section as ContentSection)) {
    notFound();
  }

  const sectionContent = getContentForSection(section as ContentSection);

  return (
    <ContentWindow 
      section={section as ContentSection} 
      items={sectionContent} 
    />
  );
};

export default SectionPage;

export function generateStaticParams() {
  return [
    { section: 'work' },
    { section: 'about' },
    { section: 'thoughts' },
    { section: 'archive' },
  ];
}