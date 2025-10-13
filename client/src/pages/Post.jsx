import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import {
  getPostBySlug,
  deletePost as deletePostService,
  getCommentsByPostId,
  deleteComment as deleteCommentService
} from "../services/postService";
import { toast } from "react-toastify";
import { socket } from "../utils/socket"; // ✅ import socket instance

export default function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!slug) return navigate("/");

    getPostBySlug(slug)
      .then((data) => {
        if (data) {
          setPost(data);
          return getCommentsByPostId(data._id);
        } else {
          navigate("/");
        }
      })
      .then((commentData) => {
        if (commentData) setComments(commentData);
      })
      .catch(() => navigate("/"));
  }, [slug, navigate]);

  // ✅ Socket.io listener for new comments
  useEffect(() => {
    if (!post) return;

    const handleNewComment = (newComment) => {
      if (newComment.postId === post._id) {
        setComments((prev) => [...prev, newComment]);
      }
    };

    socket.on("new-comment", handleNewComment);

    return () => {
      socket.off("new-comment", handleNewComment);
    };
  }, [post]);

  
  const isAuthor = useMemo(() => {
    return post && userData ? post.userId === userData._id : false;
  }, [post, userData]);

  const handleDeletePost = async () => {
    try {
      await deletePostService(post._id);
      toast.success("Post deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteCommentService(post._id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return post ? (
    <div className="py-12 bg-gray-50 min-h-screen">
      <Container>
        {/* Post Card */}
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 mb-8">
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-96 object-cover rounded-2xl mb-6"
            />
          )}

          {isAuthor && (
            <div className="flex justify-end gap-3 mb-4">
              <Link to={`/edit-post/${slug}`}>
                <Button bgColor="bg-green-500">Edit</Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={handleDeletePost}>
                Delete
              </Button>
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-full">
            {parse(post.content)}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">💬 Comments</h2>
          {comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c._id}
                className="border border-gray-200 p-4 rounded-xl mb-3 flex justify-between items-start hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-700">{c?.userName || "Anonymous"}</p>
                  <p className="text-gray-600 mt-1">{c.text}</p>
                </div>
                {(isAuthor || c.userId === userData?._id) && (
                  <Button
                    bgColor="bg-red-500"
                    className="ml-4 h-10 px-4"
                    onClick={() => handleDeleteComment(c._id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </Container>
    </div>
  ) : null;
}
