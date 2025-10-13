import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getThreadById } from '../services/threadService';
import { getRepliesByThreadId, postReply, deleteReply } from '../services/replyService';
import { getCurrentUser } from '../services/authService';
import { socket } from '../utils/socket';
import { toast } from 'react-toastify'; // ✅ import toast
import 'react-toastify/dist/ReactToastify.css';


export const ThreadView = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getThreadById(threadId).then(setThread);

    getRepliesByThreadId(threadId)
      .then((data) => setReplies(Array.isArray(data) ? data : []))
      .catch(() => setReplies([]));

    getCurrentUser().then(setCurrentUser);

    socket.emit("joinThread", threadId);

    socket.on("receive-reply", (newReply) => {
      if (newReply.threadId === threadId) {
        setReplies((prev) => [...prev, newReply]);
      }
    });

    socket.on("delete-reply", (replyId) => {
      setReplies((prev) => prev.filter((r) => r._id !== replyId));
    });

    return () => {
      socket.off("receive-reply");
      socket.off("delete-reply");
    };
  }, [threadId]);

  const handleReply = async () => {
    if (!reply.trim()) return;

    const user = await getCurrentUser();
    if (!user) {
      toast.error("You must be logged in to reply.");
      return;
    }

    const replyData = { content: reply, authorId: user._id };

    try {
      await postReply(threadId, replyData);
      setReply('');
      toast.success("Reply posted!");
    } catch (error) {
      console.error('Failed to post reply:', error);
      toast.error("Failed to post reply");
    }
  };

  const handleDeleteReply = (replyId) => {
    // ✅ Toast confirmation instead of window.confirm
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete this reply?</span>
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={async () => {
                try {
                  await deleteReply(replyId);
                  toast.dismiss(); // close confirmation toast
                  toast.success("Reply deleted successfully!");
                  // socket will update state automatically
                } catch (err) {
                  console.error(err);
                  toast.dismiss();
                  toast.error("Failed to delete reply");
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

  if (!thread)
    return <div className="text-center py-20 text-gray-500">Loading thread...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Thread Card */}
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">{thread.title}</h1>
        <p className="text-gray-700">{thread.body}</p>
      </div>

      {/* Replies Section */}
      <div className="max-w-3xl w-full space-y-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Replies</h2>

        {replies.length === 0 && (
          <p className="text-gray-500 text-center py-4 border rounded-lg bg-white">
            No replies yet. Be the first to reply!
          </p>
        )}

        {replies.map((r) => (
          <div
            key={r._id}
            className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-start hover:shadow-md transition"
          >
            <p className="text-gray-700">{r.content}</p>
            {currentUser && r.userId?.toString() === currentUser._id?.toString() && (
              <button
                onClick={() => handleDeleteReply(r._id)}
                className="ml-4 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {/* Reply Form */}
        <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col space-y-2">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button
            onClick={handleReply}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadView;
