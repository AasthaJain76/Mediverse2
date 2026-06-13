// src/pages/Contests.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        console.log("[Contests] Requesting from baseURL:", axiosInstance.defaults.baseURL);
        const res = await axiosInstance.get('/contests', {
          params: {
            limit: 20,
          },
        });
        setContests(res.data);
      } catch (err) {
        console.error('Error fetching contests:', err);
        setError('Failed to load contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getHostConfig = (host) => {
    const h = host?.toLowerCase() || "";
    if (h.includes("codeforces")) return { name: "Codeforces", color: "bg-rose-50 text-rose-600 border-rose-200" };
    if (h.includes("leetcode")) return { name: "LeetCode", color: "bg-amber-50 text-amber-600 border-amber-200" };
    if (h.includes("atcoder")) return { name: "AtCoder", color: "bg-slate-100 text-slate-700 border-slate-200" };
    if (h.includes("codechef")) return { name: "CodeChef", color: "bg-orange-50 text-orange-700 border-orange-200" };
    if (h.includes("hackerearth")) return { name: "HackerEarth", color: "bg-teal-50 text-teal-600 border-teal-200" };
    return { name: host || "Platform", color: "bg-indigo-50 text-indigo-600 border-indigo-200" };
  };

  const getDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    if (isNaN(diffMs) || diffMs <= 0) return "N/A";
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHrs > 24) {
      const days = Math.floor(diffHrs / 24);
      const remainingHrs = diffHrs % 24;
      return `${days}d ${remainingHrs}h`;
    }
    return `${diffHrs}h ${diffMins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50/50 via-white to-purple-50/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600 animate-pulse">Loading upcoming contests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50/50 via-white to-purple-50/50">
        <div className="glass-panel p-8 rounded-3xl text-center max-w-md border-red-200 bg-red-50/30">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Contests</h1>
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
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50/50 via-white to-purple-50/50 py-12 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-3">
            🏆 Upcoming Coding Contests
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Stay ahead of the competition. Register for the latest challenges across Codeforces, LeetCode, AtCoder, and more.
          </p>
        </div>

        {contests.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl max-w-xl mx-auto border-gray-200/60 bg-white/60">
            <span className="text-4xl">📭</span>
            <p className="text-gray-600 text-lg mt-4 font-medium">
              No upcoming contests found right now. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
              const hostConfig = getHostConfig(contest.host || contest.resource);
              return (
                <div
                  key={contest.id}
                  className="glass-panel bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-6 hover-lift flex flex-col justify-between"
                >
                  <div>
                    {/* Badge row */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-xl border ${hostConfig.color}`}>
                        {hostConfig.name}
                      </span>
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                        ⏱️ {getDuration(contest.start, contest.end)}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-800 mb-4 line-clamp-2 leading-snug">
                      {contest.event}
                    </h3>

                    {/* Date Details */}
                    <div className="space-y-2.5 text-sm text-gray-600 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/50 mb-6">
                      <div className="flex items-center gap-2.5">
                        <span className="text-indigo-500">📅</span>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starts</p>
                          <p className="font-semibold text-gray-700">
                            {new Date(contest.start).toLocaleDateString([], { dateStyle: 'medium' })} at {new Date(contest.start).toLocaleTimeString([], { timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-pink-500">🏁</span>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ends</p>
                          <p className="font-semibold text-gray-700">
                            {new Date(contest.end).toLocaleDateString([], { dateStyle: 'medium' })} at {new Date(contest.end).toLocaleTimeString([], { timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={contest.href || contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md hover:shadow-indigo-500/20 transition duration-300 block"
                  >
                    Register Here →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
