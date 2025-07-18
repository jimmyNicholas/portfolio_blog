import React from 'react';
import { BlogPost } from '../data/blogPosts';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <article className="border-l-4 border-gray-200 pl-6 mb-8">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <time className="text-gray-600 text-sm mb-2 block">{post.date}</time>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
            {tag}
          </span>
        ))}
      </div>
      <div className="space-y-3">
        {post.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-gray-800 leading-relaxed">
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
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};