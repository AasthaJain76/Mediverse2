import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ✅ Import useSelector
import { getProfileById } from '../services/profileService';

const ThreadCard = ({ thread, onDelete }) => {
  const [username, setUsername] = useState(thread.userName || '');
  const [canDelete, setCanDelete] = useState(false);

  // ✅ Get current user from Redux store
  const currentUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getProfileById(thread.userId);
        if (userProfile) {
          setUsername(thread.userName || userProfile.userId?.username || 'Unknown');
        }
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        setUsername(thread.userName || 'Unknown');
      }
    };

    if (thread.userName) {
      setUsername(thread.userName);
    } else if (thread.userId) {
      fetchUserData();
    } else {
      setUsername('Unknown');
    }
    
    const currentUserIdStr = (currentUser?._id || currentUser?.id || '').toString();
    const threadUserIdStr = typeof thread.userId === 'object'
      ? (thread.userId?._id || thread.userId?.id || '').toString()
      : (thread.userId || '').toString();

    if (currentUser && currentUserIdStr && threadUserIdStr && (currentUserIdStr === threadUserIdStr || currentUser.role === 'admin')) {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
  }, [thread.userId, thread.userName, currentUser]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow duration-300 relative border border-gray-200">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-blue-600 hover:underline">
          <Link to={`/forum/${thread._id}`}>{thread.title}</Link>
        </h2>

        <div className="flex gap-3 items-center">
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
