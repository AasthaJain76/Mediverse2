import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../services/profileService';
import { createThread } from '../services/threadService';
import { toast } from 'react-toastify';
import { socket } from '../utils/socket'; // ✅ import socket instance

const PostThread = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then((data) => setUser(data))
      .catch(() => {
        alert('Session expired. Please login again.');
        navigate('/login');
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to post a thread.');
      return;
    }

    try {
      const tagArray = tags.split(',').map((t) => t.trim());
      const thread = await createThread({
        title,
        body,
        tags: tagArray,
        authorId: user._id,
      });

      // ✅ Emit event so others get real-time update
      socket.emit("new-thread", thread);
      toast.success('✅ Thread posted successfully!');
      navigate(`/forum/${thread._id}`);
    } catch (err) {
      toast.error('❌ Failed to post thread. Try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-3xl p-8 hover:shadow-2xl transition-all">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          📝 Create a New Thread
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thread Title"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your content here..."
            className="w-full border border-gray-300 p-3 rounded-xl h-44 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Post Thread
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostThread;
