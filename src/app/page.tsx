import React from 'react';
import { BlogList } from './components/BlogComponents';
import { blogPosts } from './data/blogPosts';

const HomePage = () => {
  return <BlogList posts={blogPosts} title="Recent Thoughts" />;
};

export default HomePage;