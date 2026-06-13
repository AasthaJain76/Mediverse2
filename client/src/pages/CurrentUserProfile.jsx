import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyProfile, getProfileById, updateMyProfile } from "../services/profileService";

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [formData, setFormData] = useState({
    batch: "",
    department: "",
    skills: "",
    interests: "",
    achievements: "",
    github: "",
    linkedin: "",
    leetcodeUsername: "",
    codeforcesHandle: "",
  });

  const getLeetCodeUrl = (username) => {
    if (!username) return "";
    if (username.startsWith("http://") || username.startsWith("https://")) {
      return username;
    }
    return `https://leetcode.com/u/${username}`;
  };

  const getCodeforcesUrl = (handle) => {
    if (!handle) return "";
    if (handle.startsWith("http://") || handle.startsWith("https://")) {
      return handle;
    }
    return `https://codeforces.com/profile/${handle}`;
  };

  const getDisplayUsername = (val) => {
    if (!val) return "";
    if (val.startsWith("http://") || val.startsWith("https://")) {
      const cleaned = val.replace(/\/$/, "");
      const parts = cleaned.split("/");
      return parts[parts.length - 1];
    }
    return val;
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSave(true);
      const updatedProfile = {
        batch: formData.batch,
        department: formData.department,
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        interests: formData.interests ? formData.interests.split(",").map(s => s.trim()).filter(Boolean) : [],
        achievements: formData.achievements ? formData.achievements.split(",").map(s => s.trim()).filter(Boolean) : [],
        github: formData.github,
        linkedin: formData.linkedin,
        leetcode: {
          ...profile.leetcode,
          username: formData.leetcodeUsername
        },
        codeforces: {
          ...profile.codeforces,
          handle: formData.codeforcesHandle
        }
      };

      const res = await updateMyProfile(updatedProfile);
      setProfile(res);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    } finally {
      setLoadingSave(false);
    }
  };

  if (error)
    return <p className="text-red-600 text-center mt-12 text-base">{error}</p>;
  if (!profile)
    return (
      <p className="text-center mt-12 text-gray-500 text-base">
        Loading profile...
      </p>
    );

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-2xl font-extrabold text-blue-600 mb-6 text-center">
          ✏️ Edit Profile
        </h1>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">Batch:</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g. 2025"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="e.g. CSE"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">Skills (comma-separated):</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="React, Node, Python"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">Interests (comma-separated):</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="AI, Web3, Mobile"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">GitHub URL:</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">LinkedIn URL:</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">LeetCode Username:</label>
              <input
                type="text"
                name="leetcodeUsername"
                value={formData.leetcodeUsername}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-800">Codeforces Handle:</label>
              <input
                type="text"
                name="codeforcesHandle"
                value={formData.codeforcesHandle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="handle"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">Achievements (comma-separated):</label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Award X, Hackathon Y Winner"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingSave}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition disabled:opacity-50"
            >
              {loadingSave ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    );
  }

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
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFormData({
                  batch: profile.batch || "",
                  department: profile.department || "",
                  skills: profile.skills ? profile.skills.join(", ") : "",
                  interests: profile.interests ? profile.interests.join(", ") : "",
                  achievements: profile.achievements ? profile.achievements.join(", ") : "",
                  github: profile.github || "",
                  linkedin: profile.linkedin || "",
                  leetcodeUsername: profile.leetcode?.username || "",
                  codeforcesHandle: profile.codeforces?.handle || "",
                });
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition text-sm md:text-base font-semibold"
            >
              ✏️ Edit Profile
            </button>
            <Link
              to="/my-roadmaps"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm md:text-base font-semibold"
            >
              📌 My Roadmaps
            </Link>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mb-8">
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
                  href={getLeetCodeUrl(profile.leetcode.username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-100 text-gray-800 rounded-lg shadow hover:bg-yellow-200 transition text-sm md:text-base"
                >
                  🟨 LeetCode: {getDisplayUsername(profile.leetcode.username)} (
                  {profile.leetcode.stats?.totalSolved ?? 0} solved, rating{" "}
                  {profile.leetcode.stats?.rating ?? "N/A"})
                </a>
              )}
              {profile.codeforces?.handle && (
                <a
                  href={getCodeforcesUrl(profile.codeforces.handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-100 text-gray-800 rounded-lg shadow hover:bg-blue-200 transition text-sm md:text-base"
                >
                  🔵 Codeforces: {getDisplayUsername(profile.codeforces.handle)} (rating{" "}
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
