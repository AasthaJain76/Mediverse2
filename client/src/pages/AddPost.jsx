import React from 'react';
import { Container, PostForm } from '../components';

function AddPost() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-6">
            Create a New Post
          </h1>

          <PostForm />
        </div>
      </Container>
    </div>
  );
}

export default AddPost;
