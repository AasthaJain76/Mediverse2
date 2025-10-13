import React, { useEffect, useState } from 'react';
import { Container, PostForm } from '../components';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/postService';

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug)
        .then((fetchedPost) => {
          if (fetchedPost) setPost(fetchedPost);
          else navigate('/'); // Redirect if post not found
        })
        .catch((err) => {
          console.error("Failed to fetch post:", err);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [slug, navigate]);

  if (!post) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading post for editing...
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            ✍️ Edit Your Post
          </h1>
          <PostForm post={post} />
        </div>
      </Container>
    </div>
  );
}

export default EditPost;
