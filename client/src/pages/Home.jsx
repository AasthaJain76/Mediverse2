import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";
import { getAllPosts } from "../services/postService";
import { getAllThreads } from "../services/threadService";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

function Home() {
  const [posts, setPosts] = useState([]);
  const [contests, setContests] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🔹 Latest posts
        const postData = await getAllPosts();
        setPosts(postData.slice(0, 3));

        // 🔹 Upcoming contests
        console.log("[Home] Requesting contests from baseURL:", axiosInstance.defaults.baseURL);
        const res = await axiosInstance.get("/contests", {
          params: {
            limit: 3,
          },
        });
        setContests(res.data);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-600 animate-pulse">
            Loading your dashboard...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50/50">
        <div className="glass-panel p-8 rounded-3xl text-center max-w-md border-red-200 bg-red-50/30">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Occurred</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md transition"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-tr from-indigo-50/50 via-white to-purple-50/50 relative overflow-hidden pb-12">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <Container className="px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Hero Panel */}
        <section className="pt-12 pb-8">
          <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-xl border border-white/40 bg-white/60 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
                {userData?.username ? `Welcome back, ${userData.username}! 👋` : "Welcome to MediVerse 👋"}
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-xl">
                🚀 Code your dreams, conquer your future — nothing is out of reach! Track contests, participate in discussions, and analyze your growth.
              </p>
            </div>
            
            {/* Quick Actions / Stats */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <Link to="/generate" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all duration-300">
                Generate Roadmap 🗺️
              </Link>
              <Link to="/features" className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl border border-gray-200 shadow-sm transition-all duration-300">
                Analyze Resume 📄
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Sections Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {/* Latest Posts */}
          <div className="glass-panel bg-white/75 backdrop-blur-md border border-white/50 rounded-3xl p-6 hover-lift">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <span className="w-10 h-10 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-lg shadow-sm">📝</span>
                Latest Posts
              </h2>
              <span className="text-xs font-semibold bg-purple-100/60 text-purple-700 px-2.5 py-1 rounded-full">Updates</span>
            </div>

            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => {
                  const plainContent = post.content.replace(/<\/?[^>]+(>|$)/g, "");
                  const snippet = plainContent.split(" ").slice(0, 10).join(" ") + (plainContent.split(" ").length > 10 ? "..." : "");

                  return (
                    <Link
                      key={post._id}
                      to={`/post/${post._id}`}
                      className="block p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100/50 transition duration-300"
                    >
                      <h3 className="font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-purple-700 transition">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{snippet}</p>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No posts yet</p>
                </div>
              )}
            </div>

            <Link
              to="/all-posts"
              className="block text-center mt-6 text-sm text-purple-600 font-bold hover:text-purple-800 transition"
            >
              View All Posts →
            </Link>
          </div>

          {/* Upcoming Contests */}
          <div className="glass-panel bg-white/75 backdrop-blur-md border border-white/50 rounded-3xl p-6 hover-lift">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-lg shadow-sm">🏆</span>
                Upcoming Contests
              </h2>
              <span className="text-xs font-semibold bg-blue-100/60 text-blue-700 px-2.5 py-1 rounded-full">Competitive</span>
            </div>

            <div className="space-y-4">
              {contests.length > 0 ? (
                contests.map((contest) => (
                  <div
                    key={contest.id}
                    className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100/50 transition duration-300"
                  >
                    <h3 className="font-bold text-gray-800 line-clamp-1 mb-1">
                      {contest.event}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold bg-white text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                        {contest.resource?.split('.')[0] || "Codeforces"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(contest.start).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No contests scheduled</p>
                </div>
              )}
            </div>

            <Link
              to="/contests"
              className="block text-center mt-6 text-sm text-blue-600 font-bold hover:text-blue-800 transition"
            >
              View All Contests →
            </Link>
          </div>

          {/* Active Discussions */}
          <div className="glass-panel bg-white/75 backdrop-blur-md border border-white/50 rounded-3xl p-6 hover-lift">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <span className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-lg shadow-sm">💬</span>
                Discussions
              </h2>
              <span className="text-xs font-semibold bg-green-100/60 text-green-700 px-2.5 py-1 rounded-full">Forum</span>
            </div>

            <div className="space-y-4">
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <Link
                    key={thread._id}
                    to="/forum"
                    className="block p-4 rounded-2xl bg-green-50/50 hover:bg-green-100/60 border border-green-100/50 transition duration-300"
                  >
                    <h3 className="font-bold text-gray-800 line-clamp-1 mb-1">
                      {thread.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {thread.content}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No active discussions</p>
                </div>
              )}
            </div>

            <Link
              to="/forum"
              className="block text-center mt-6 text-sm text-green-600 font-bold hover:text-green-800 transition"
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
