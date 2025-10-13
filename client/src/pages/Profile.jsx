import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyProfile, getProfileById } from "../services/profileService";

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data;
        if (userId && userId !== "undefined") {
          data = await getProfileById(userId);
          const myProfile = await getMyProfile();
          setLoggedInUserId(myProfile?.userId?._id || null);
        } else {
          data = await getMyProfile();
          setLoggedInUserId(data?.userId?._id || null);
        }

        if (!data || Object.keys(data).length === 0) {
          setError("Profile not found");
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("You must be logged in to view your profile.");
      }
    };

    fetchProfile();
  }, [userId]);

  if (error)
    return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!profile)
    return (
      <p className="text-center mt-10 text-gray-500 font-medium animate-pulse">
        Loading profile...
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold text-blue-600">
          {userId && userId !== "undefined"
            ? `${profile.userId?.username}'s Profile`
            : "My Profile"}
        </h1>
        {profile.userId?._id === loggedInUserId && (
          <Link
            to="/my-roadmaps"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-indigo-500 hover:to-blue-500 transition"
          >
            📌 My Roadmaps
          </Link>
        )}
      </div>

      {/* Profile Card */}
      <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-6 shadow-inner">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-400 rounded-full mb-4 text-xl font-semibold">
            No Avatar
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-800">
          {profile.userId?.username}{" "}
          {profile.userId?._id === loggedInUserId && (
            <span className="text-xs text-gray-500">(You)</span>
          )}
        </h1>
        <p className="text-gray-500 mb-4">{profile.batch || "Batch N/A"}</p>
      </div>

      {/* Profile Details */}
      <div className="mt-8 space-y-6 text-gray-700">
        {/* Skills */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">💡 Skills & Interests</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1 bg-gradient-to-r from-green-200 to-green-300 text-green-900 rounded-full font-medium text-sm shadow-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No skills added</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">🏆 Achievements</h2>
          {profile.achievements && profile.achievements.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {profile.achievements.map((ach, idx) => (
                <li key={idx} className="text-gray-700">
                  {ach}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No achievements listed</p>
          )}
        </div>

        {/* Competitive Programming */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">💻 Competitive Programming</h2>
          {profile.leetcode?.username || profile.codeforces?.handle ? (
            <div className="flex flex-col gap-2">
              {profile.leetcode?.username && (
                <a
                  href={`https://leetcode.com/${profile.leetcode.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg shadow-sm text-gray-800 font-medium transition"
                >
                  🟨 LeetCode: {profile.leetcode.username} (
                  {profile.leetcode.stats.totalSolved} solved, rating{" "}
                  {profile.leetcode.stats.rating})
                </a>
              )}
              {profile.codeforces?.handle && (
                <a
                  href={`https://codeforces.com/profile/${profile.codeforces.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg shadow-sm text-gray-800 font-medium transition"
                >
                  🔵 Codeforces: {profile.codeforces.handle} (rating{" "}
                  {profile.codeforces.rating}, max {profile.codeforces.maxRating})
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No CP profiles linked</p>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
          >
            LinkedIn
          </a>
        )}
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-black text-white font-medium shadow transition"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}
