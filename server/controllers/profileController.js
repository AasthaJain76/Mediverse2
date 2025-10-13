import Profile from "../models/Profile.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import fs from "fs";
import mongoose from "mongoose";

export const updateMyProfile = async (req, res) => {
  console.log("📩 Incoming body:", req.body);

  try {
    const profileData = {
      userId: req.user._id,
      batch: req.body.batch,
      department: req.body.department,
      skills: req.body.skills || [],
      interests: req.body.interests || [],
      github: req.body.github,
      linkedin: req.body.linkedin,
      repositories: req.body.repositories || [],

      leetcode: req.body.leetcode || {},   
      codeforces: req.body.codeforces || {}, 

      achievements: req.body.achievements || [],
      extracurriculars: req.body.extracurriculars || [],
      avatar: req.body.avatar,
    };

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("❌ Profile update error:", error);
    res.status(500).json({ message: "Failed to create/update profile" });
  }
};


export const getMyProfile = async (req, res) => {
  console.log("IN getMyProfile");
  console.log("req.user:", req.user);

  try {
     const profile = await Profile.findOne({ userId: req.user._id }).populate("userId", "username email");
    console.log("🟢 Sending profile data:", profile);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


export const getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId }).populate("userId", "username email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


export const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Delete Profile
    await Profile.findOneAndDelete({ userId });

    // 2. Delete Posts & images
    const posts = await Post.find({ userId });
    for (let post of posts) {
      if (post.featuredImage) {
        fs.unlink(`uploads/${post.featuredImage}`, (err) => {
          if (err) console.log("Failed to delete image:", err.message);
        });
      }
    }
    await Post.deleteMany({ userId });

    // 3. Delete User
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account, profile, and posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account", error: error.message });
  }
};
