import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfileById } from '../services/profileService';
import { getCurrentUser } from '../services/authService';

const ThreadCard = ({ thread, onDelete }) => {
  const [username, setUsername] = useState('');
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getProfileById(thread.authorId);
        if (userProfile) {
          setUsername(userProfile.userName || 'Unknown');
        }
        const currentUser = getCurrentUser();
        if (currentUser?.$id === thread.authorId || currentUser?.role === 'admin') {
          setCanDelete(true);
        }
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };

    if (thread.authorId) fetchUserData();
  }, [thread.authorId]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow duration-300 relative border border-gray-200">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-blue-600 hover:underline">
          <Link to={`/forum/${thread._id}`}>{thread.title}</Link>
        </h2>

        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-500">{thread.upvotes || 0} 👍</span>

          {canDelete && (
            <button
              onClick={() => onDelete(thread._id)}
              className="text-red-500 text-sm font-medium hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 mt-2 line-clamp-3">{thread.body}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(thread.tags || []).map(tag => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded cursor-pointer hover:bg-blue-200 transition"
          >
            #{tag}
          </span>
        ))}
      </div>

      {username && (
        <div className="absolute bottom-3 right-4 text-xs text-gray-500 italic">
          Posted by: {username}
        </div>
      )}
    </div>
  );
};

export default ThreadCard;
