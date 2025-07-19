import React from 'react';
import { ContentItem, ContentSection } from "../data/index";

interface ContentWindowProps {
  section: ContentSection;
  items: ContentItem[];
}

export const ContentWindow: React.FC<ContentWindowProps> = ({ section, items }) => {
  const getSectionTitle = (section: ContentSection) => {
    const titles = {
      work: 'Work & Projects',
      about: 'About Me',
      thoughts: 'Thoughts',
      archive: 'Archive'
    };
    return titles[section];
  };

  const renderContentItem = (item: ContentItem) => {
    switch (item.type) {
      case 'post':
        return (
          <article key={item.id} className="border-l-4 border-accent pl-6 mb-8 themed-filter">
            <h2 className="text-xl font-semibold mb-2 text-themed">
              {item.title}
            </h2>
            
            {item.date && (
              <time className="text-sm mb-2 block text-muted">
                {item.date}
              </time>
            )}
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="themed-tag px-2 py-1 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              {item.content.map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-accent">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        );

      case 'project':
        return (
          <article key={item.id} className="border-2 border-accent rounded-lg p-6 mb-6 themed-filter">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-themed">
                {item.title}
              </h2>
              {item.status && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.status === 'active' ? 'themed-tag' : 'text-muted'
                }`}>
                  {item.status}
                </span>
              )}
            </div>
            
            {item.tech && item.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tech.map((tech) => (
                  <span 
                    key={tech} 
                    className="bg-accent text-themed px-2 py-1 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              {item.content.map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-accent">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {item.link && (
              <div className="mt-4">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-themed hover:text-accent transition-colors"
                >
                  View Project →
                </a>
              </div>
            )}
          </article>
        );

      case 'bio':
        return (
          <div key={item.id} className="space-y-6 px-8">
            <div className="space-y-4 pb-4">
              {item.content.map((paragraph, index) => (
                <p key={index} className="text-accent leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-themed themed-filter">
        {getSectionTitle(section)}
      </h1>
      
      <div className="space-y-6">
        {items.map(renderContentItem)}
      </div>
    </div>
  );
};

export default ContentWindow;