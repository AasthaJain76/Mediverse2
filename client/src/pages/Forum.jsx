import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ThreadCard from '../components/ThreadCard';
import { getAllThreads, deleteThread } from '../services/threadService';
import { socket } from '../utils/socket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import styles

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loggedInUser = useSelector(state => state.auth.userData);
  const loggedInUserId = loggedInUser?._id;
  const isAdmin = loggedInUser?.role === "admin";

  const fetchThreads = async () => {
    try {
      const fetchedThreads = await getAllThreads();
      const threadsArray = Array.isArray(fetchedThreads) ? fetchedThreads : [];
      setThreads(threadsArray);

      const allTags = new Set();
      threadsArray.forEach(thread => {
        thread.tags?.forEach(tag => allTags.add(tag));
      });
      setTags([...allTags]);
    } catch (err) {
      console.error('Failed to fetch threads:', err);
      setError('Failed to load threads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();

    socket.on("new-thread", (newThread) => {
      setThreads(prev => [newThread, ...prev]);
      newThread.tags?.forEach(tag => {
        if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
      });
    });

    return () => socket.off("new-thread");
  }, []);


  const handleDelete = (threadId) => {
    // ✅ Show custom toast confirmation
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this thread?</span>
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={async () => {
                try {
                  await deleteThread(threadId);
                  setThreads(prev => prev.filter(t => t._id !== threadId));
                  toast.dismiss(); // close confirmation toast
                  toast.success("Thread deleted successfully!");
                } catch (err) {
                  console.error(err);
                  toast.dismiss();
                  toast.error("Failed to delete thread.");
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };


  const filteredThreads = Array.isArray(threads)
    ? (selectedTag ? threads.filter(t => t.tags?.includes(selectedTag)) : threads)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col items-center justify-center p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Discussion Forum</h1>

        <Link to="/post-thread">
          <button className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Start a New Thread
          </button>
        </Link>

        <div className="mb-4">
          <select
            onChange={(e) => setSelectedTag(e.target.value)}
            className="p-2 border rounded"
            value={selectedTag}
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading threads...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredThreads.length === 0 ? (
          <p className="text-gray-500">No threads found for the selected tag.</p>
        ) : (
          filteredThreads.map(thread => (
            <div
              key={thread._id}
              className="mb-4 border p-4 rounded shadow-sm flex justify-between items-center hover:shadow-md transition"
            >
              <ThreadCard thread={thread} />

              {(thread.userId === loggedInUserId || isAdmin) && (
                <button
                  onClick={() => handleDelete(thread._id)}
                  className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;
