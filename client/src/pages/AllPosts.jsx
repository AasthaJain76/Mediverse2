import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import { getAllPosts } from '../services/postService';

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPosts().then((fetchedPosts) => {
      setPosts(fetchedPosts);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Reduced slightly for balance */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-8">
          All Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-sm md:text-base text-gray-500 text-center mt-12">
            No posts available yet. Be the first to create one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} {...post} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
