import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ✅ Import useSelector
import { getThreadById, updateThread, deleteThread } from '../services/threadService';
import { getRepliesByThreadId, postReply, deleteReply, updateReply } from '../services/replyService';
import { getCurrentUser } from '../services/authService';
import { socket } from '../utils/socket';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


export const ThreadView = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState('');
  
  // ✅ Retrieve currentUser directly from Redux store
  const currentUser = useSelector((state) => state.auth.userData);

  // Thread editing states
  const [isEditingThread, setIsEditingThread] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  // Reply editing states
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const getItemUserIdStr = (itemUserId) => {
    if (!itemUserId) return '';
    if (typeof itemUserId === 'object') {
      return (itemUserId._id || itemUserId.id || '').toString();
    }
    return itemUserId.toString();
  };

  const canEdit = (itemUserId) => {
    if (!currentUser || !itemUserId) return false;
    const currentUserIdStr = (currentUser._id || currentUser.id || '').toString();
    const itemUserIdStr = getItemUserIdStr(itemUserId);
    return currentUserIdStr && itemUserIdStr && (currentUserIdStr === itemUserIdStr || currentUser.role === 'admin');
  };

  const canDelete = (itemUserId) => {
    if (!currentUser || !itemUserId) return false;
    const currentUserIdStr = (currentUser._id || currentUser.id || '').toString();
    const itemUserIdStr = getItemUserIdStr(itemUserId);
    return currentUserIdStr && itemUserIdStr && (currentUserIdStr === itemUserIdStr || currentUser.role === 'admin');
  };

  useEffect(() => {
    console.log("ThreadView mounted/updated. threadId:", threadId, "currentUser:", currentUser);
    
    getThreadById(threadId).then((data) => {
      console.log("Fetched thread:", data);
      setThread(data);
    });

    getRepliesByThreadId(threadId)
      .then((data) => {
        console.log("Fetched replies:", data);
        setReplies(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch replies:", err);
        setReplies([]);
      });

    socket.emit("joinThread", threadId);

    socket.on("receive-reply", (newReply) => {
      console.log("Socket receive-reply event:", newReply);
      if (newReply.threadId?.toString() === threadId?.toString()) { // ✅ Safe comparison
        setReplies((prev) => {
          if (prev.some((r) => r._id === newReply._id)) {
            console.log("Reply already in list (socket ignored)");
            return prev;
          }
          console.log("Prepended reply via socket:", newReply);
          return [newReply, ...prev]; // Prepend newest reply
        });
      }
    });

    socket.on("delete-reply", (replyId) => {
      setReplies((prev) => prev.filter((r) => r._id !== replyId));
    });

    socket.on("update-reply", (updatedReply) => {
      setReplies((prev) => prev.map((r) => r._id === updatedReply._id ? updatedReply : r));
    });

    socket.on("update-thread", (updatedThread) => {
      if (updatedThread._id === threadId) {
        setThread(updatedThread);
      }
    });

    return () => {
      socket.off("receive-reply");
      socket.off("delete-reply");
      socket.off("update-reply");
      socket.off("update-thread");
    };
  }, [threadId]);

  const handleReply = async () => {
    if (!reply.trim()) return;

    if (!currentUser) {
      toast.error("You must be logged in to reply.");
      return;
    }

    const replyData = { content: reply };

    try {
      console.log("Posting reply with data:", replyData);
      const newReply = await postReply(threadId, replyData);
      console.log("Successfully posted reply, server returned:", newReply);
      setReply('');
      toast.success("Reply posted!");
      setReplies((prev) => {
        if (prev.some((r) => r._id === newReply._id)) {
          console.log("Reply already in list (HTTP ignored)");
          return prev;
        }
        console.log("Prepended reply via HTTP:", newReply);
        return [newReply, ...prev]; // Prepend local state immediately
      });
    } catch (error) {
      console.error('Failed to post reply:', error);
      toast.error("Failed to post reply");
    }
  };

  const handleUpdateThread = async () => {
    if (!editTitle.trim() || !editBody.trim()) {
      toast.error("Title and body cannot be empty");
      return;
    }
    try {
      const updated = await updateThread(threadId, { title: editTitle, body: editBody });
      setThread(updated);
      setIsEditingThread(false);
      toast.success("Thread updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update thread");
    }
  };
 
  const handleDeleteThread = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Thread",
      message: "Are you sure you want to delete this thread? This action cannot be undone and will delete all replies.",
      onConfirm: async () => {
        try {
          await deleteThread(threadId);
          toast.success("Thread deleted successfully!");
          navigate('/forum');
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete thread");
        }
      }
    });
  };

  const handleUpdateReply = async (replyId) => {
    if (!editingReplyContent.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }
    try {
      const updated = await updateReply(replyId, { content: editingReplyContent });
      setReplies((prev) => prev.map((r) => r._id === replyId ? updated : r));
      setEditingReplyId(null);
      toast.success("Reply updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update reply");
    }
  };

  const handleDeleteReply = (replyId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Reply",
      message: "Are you sure you want to delete this reply? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteReply(replyId);
          toast.success("Reply deleted successfully!");
          setReplies((prev) => prev.filter((r) => r._id !== replyId));
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete reply");
        }
      }
    });
  };

  if (!thread)
    return <div className="text-center py-20 text-gray-500">Loading thread...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Back to Forum Link */}
      <div className="max-w-3xl w-full text-left mb-4">
        <Link to="/forum" className="text-indigo-600 hover:text-indigo-800 font-bold text-sm">
          ← Back to Forum
        </Link>
      </div>

      {/* Thread Card */}
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-200">
        {isEditingThread ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Content</label>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 min-h-[120px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditingThread(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateThread}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-3 flex-1">{thread.title}</h1>
              {currentUser && (
                <div className="flex gap-2 ml-4">
                  {canEdit(thread.userId) && (
                    <button
                      onClick={() => {
                        setEditTitle(thread.title);
                        setEditBody(thread.body);
                        setIsEditingThread(true);
                      }}
                      className="ml-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-indigo-100/50"
                    >
                      ✏️ Edit
                    </button>
                  )}
                  {canDelete(thread.userId) && (
                    <button
                      onClick={handleDeleteThread}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-red-100/50"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{thread.body}</p>
          </div>
        )}
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
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {editingReplyId === r._id ? (
              <div className="space-y-3 w-full">
                <textarea
                  value={editingReplyContent}
                  onChange={(e) => setEditingReplyContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 min-h-[80px]"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingReplyId(null)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateReply(r._id)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start w-full">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-800">{r.userName || "User"}</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(r.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">{r.content}</p>
                </div>
                {currentUser && (
                  <div className="flex gap-2 ml-4">
                    {canEdit(r.userId) && (
                      <button
                        onClick={() => {
                          setEditingReplyId(r._id);
                          setEditingReplyContent(r.content);
                        }}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold transition border border-gray-200/60"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete(r.userId) && (
                      <button
                        onClick={() => handleDeleteReply(r._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold transition border border-red-100/50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
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

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{confirmModal.title}</h3>
            <p className="text-gray-600 mb-6 text-sm">{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (confirmModal.onConfirm) {
                    await confirmModal.onConfirm();
                  }
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-md shadow-red-500/20 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadView;
