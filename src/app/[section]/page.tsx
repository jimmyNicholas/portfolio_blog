import { BlogList } from '../components/BlogComponents';
import { blogPosts } from '../data/blogPosts';
import { notFound } from 'next/navigation';

interface SectionPageProps {
  params: {
    section: string;
  };
}

const validSections = ['music', 'teaching', 'code'] as const;

const SectionPage = ({ params }: SectionPageProps) => {
  const { section } = params;
  
  if (!validSections.includes(section as unknown as typeof validSections[number])) {
    notFound();
  }
  
  const sectionPosts = blogPosts.filter(post => post.section === section);
  const title = section.charAt(0).toUpperCase() + section.slice(1);
  
  return <BlogList posts={sectionPosts} title={title} />;
};

export default SectionPage;

export function generateStaticParams() {
  return [
    { section: 'music' },
    { section: 'teaching' }, 
    { section: 'code' },
  ];
}