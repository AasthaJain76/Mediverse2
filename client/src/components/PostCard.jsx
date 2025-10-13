import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { toggleLikePost, addComment } from "../services/postService";

export default function PostCard({
  _id,
  slug,
  title,
  featuredImage,
  userName,
  userId,
  likes = [],
  comments = [],
}) {
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(likes.length);
  const [likedByUser, setLikedByUser] = useState(false);
  const [commentList, setCommentList] = useState(comments);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const goToPost = () => navigate(`/posts/${slug}`);
  const goToProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${userId}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await toggleLikePost(_id);
      setLikeCount(res.likes);
      setLikedByUser(res.likedByUser);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await addComment(_id, commentText);
      setCommentList([res.comment, ...commentList]);
      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  return (
    <div
      onClick={goToPost}
      className="w-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 cursor-pointer border border-gray-200"
    >
      {/* Author */}
      <h2
        className="text-lg md:text-xl font-semibold mb-2 text-blue-600 hover:underline"
        onClick={goToProfile}
      >
        {userName || "Unknown Author"}
      </h2>

      {/* Featured Image */}
      {featuredImage && (
        <div className="w-full mb-4 overflow-hidden rounded-xl">
          <img
            src={featuredImage}
            alt={title}
            className="w-full max-h-60 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Post Title */}
      <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800">{title}</h3>

      {/* Likes & Comments */}
      <div className="flex items-center gap-6 mt-3 text-gray-600 text-sm md:text-base">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition-colors ${
            likedByUser ? "text-blue-600 font-semibold" : "hover:text-blue-500"
          }`}
        >
          <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
          <span>{likeCount}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCommentBox((prev) => !prev);
          }}
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span>{commentList.length}</span>
        </button>
      </div>

      {/* Comment Box */}
      {showCommentBox && (
        <form
          onSubmit={handleAddComment}
          className="mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg transition-colors"
          >
            Comment
          </button>
        </form>
      )}

      {/* Comment List Preview */}
      {commentList.length > 0 && (
        <div className="mt-3 space-y-2 text-gray-700 text-sm max-h-40 overflow-y-auto">
          {commentList.slice(0, 3).map((c, idx) => (
            <p key={idx} className="border-b border-gray-200 pb-1">
              <span className="font-semibold">{c.userName || "User"}:</span> {c.text}
            </p>
          ))}
          {commentList.length > 3 && (
            <p className="text-gray-500 text-xs">+{commentList.length - 3} more comments</p>
          )}
        </div>
      )}
    </div>
  );
}
