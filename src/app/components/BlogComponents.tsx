import React from 'react';
import { BlogPost } from '../data/blogPosts';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <article className="pl-6 mb-8 themed-filter">
      <h2 className="text-xl font-semibold mb-2 text-themed">
        {post.title}
      </h2>
      
      <time className="text-sm mb-2 block text-muted">
        {post.date}
      </time>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span 
            key={tag} 
            className="themed-tag px-2 py-1 rounded-md text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="space-y-3">
        {post.paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed text-accent">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
};

interface BlogListProps {
  posts: BlogPost[];
  title: string;
}

export const BlogList: React.FC<BlogListProps> = ({ posts, title }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-themed themed-filter">
        {title}
      </h1>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};