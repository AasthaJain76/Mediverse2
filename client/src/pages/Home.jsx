import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";
import { getAllPosts } from "../services/postService";
import { getAllThreads } from "../services/threadService";
import axios from "axios";
import conf from "../conf/conf";

function Home() {
  const [posts, setPosts] = useState([]);
  const [contests, setContests] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🔹 Latest posts
        const postData = await getAllPosts();
        setPosts(postData.slice(0, 3));

        // 🔹 Upcoming contests
        const username = conf.clist_userName;
        const apiKey = conf.clist_ApiKey;
        const now = new Date().toISOString();
        const platforms = "1,102,73,74,368";

        const res = await axios.get("https://clist.by/api/v2/contest/", {
          params: {
            start__gte: now,
            order_by: "start",
            limit: 3,
            resource_id_in: platforms,
          },
          headers: {
            Authorization: `ApiKey ${username}:${apiKey}`,
          },
        });
        setContests(res.data.objects);

        // 🔹 Active discussions
        const threadData = await getAllThreads();
        setThreads(threadData.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50">
        <h1 className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading dashboard...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50">
        <h1 className="text-xl font-semibold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h2 className="mt-4 text-lg md:text-xl font-semibold bg-clip-text text-transparent 
                 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-400">
          🚀 Code your dreams, conquer your future — nothing is out of reach!
        </h2>
      </section>


      {/* Dashboard Sections */}
      <Container>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {/* Latest Posts */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition">
            <h2 className="flex items-center gap-2 text-xl font-bold text-purple-700 mb-4">
              <span className="p-2 bg-purple-100 text-purple-600 rounded-full">📝</span>
              Latest Posts
            </h2>

            {posts.length > 0 ? (
              posts.map((post) => {
                // strip HTML tags from content
                const plainContent = post.content.replace(/<\/?[^>]+(>|$)/g, "");
                const snippet = plainContent.split(" ").slice(0, 3).join(" ") + (plainContent.split(" ").length > 3 ? "..." : "");

                return (
                  <div
                    key={post._id}
                    className="p-3 mb-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition"
                  >
                    <h3 className="font-medium text-gray-800 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-gray-600">{snippet}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No posts yet</p>
            )}

            <Link
              to="/all-posts"
              className="block text-center mt-4 text-purple-700 font-medium hover:underline"
            >
              View All Posts →
            </Link>
          </div>

          {/* Upcoming Contests */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition">
            <h2 className="flex items-center gap-2 text-xl font-bold text-blue-700 mb-4">
              <span className="p-2 bg-blue-100 text-blue-600 rounded-full">🏆</span>
              Upcoming Contests
            </h2>
            {contests.length > 0 ? (
              contests.map((contest) => (
                <div
                  key={contest.id}
                  className="p-3 mb-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                >
                  <h3 className="font-medium text-gray-800 line-clamp-1">
                    {contest.event}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(contest.start).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No contests available</p>
            )}
            <Link
              to="/contests"
              className="block text-center mt-4 text-blue-700 font-medium hover:underline"
            >
              View All Contests →
            </Link>
          </div>

          {/* Active Discussions */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition">
            <h2 className="flex items-center gap-2 text-xl font-bold text-green-700 mb-4">
              <span className="p-2 bg-green-100 text-green-600 rounded-full">💬</span>
              Active Discussions
            </h2>
            {threads.length > 0 ? (
              threads.map((thread) => (
                <div
                  key={thread._id}
                  className="p-3 mb-3 rounded-lg bg-green-50 hover:bg-green-100 transition"
                >
                  <h3 className="font-medium text-gray-800 line-clamp-1">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {thread.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active discussions</p>
            )}
            <Link
              to="/forum"
              className="block text-center mt-4 text-green-700 font-medium hover:underline"
            >
              Go to Forum →
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default Home;
