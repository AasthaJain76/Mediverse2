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
    return <p className="text-red-600 text-center mt-12 text-base">{error}</p>;
  if (!profile)
    return (
      <p className="text-center mt-12 text-gray-500 text-base">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm md:text-base"
          >
            📌 My Roadmaps
          </Link>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mb-8">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-4 shadow-md"
          />
        ) : (
          <div className="w-28 h-28 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full mb-4 text-sm font-medium">
            No Avatar
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {profile.userId?.username}
          {profile.userId?._id === loggedInUserId && (
            <span className="text-xs text-gray-500">(You)</span>
          )}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          {profile.batch || "Batch N/A"}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6 text-gray-700">
        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">
            Skills & Interests
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No skills added</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">
            Achievements
          </h3>
          {profile.achievements && profile.achievements.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              {profile.achievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No achievements listed</p>
          )}
        </div>

        {/* Competitive Programming */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">
            Competitive Programming
          </h3>
          {profile.leetcode?.username || profile.codeforces?.handle ? (
            <div className="flex flex-col gap-2">
              {profile.leetcode?.username && (
                <a
                  href={`https://leetcode.com/${profile.leetcode.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-100 text-gray-800 rounded-lg shadow hover:bg-yellow-200 transition text-sm md:text-base"
                >
                  🟨 LeetCode: {profile.leetcode.username} (
                  {profile.leetcode.stats?.totalSolved ?? 0} solved, rating{" "}
                  {profile.leetcode.stats?.rating ?? "N/A"})
                </a>
              )}
              {profile.codeforces?.handle && (
                <a
                  href={`https://codeforces.com/profile/${profile.codeforces.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-100 text-gray-800 rounded-lg shadow hover:bg-blue-200 transition text-sm md:text-base"
                >
                  🔵 Codeforces: {profile.codeforces.handle} (rating{" "}
                  {profile.codeforces.rating ?? "N/A"}, max{" "}
                  {profile.codeforces.maxRating ?? "N/A"})
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No CP profiles linked</p>
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
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition text-sm md:text-base"
          >
            LinkedIn
          </a>
        )}
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-lg font-medium shadow transition text-sm md:text-base"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}
