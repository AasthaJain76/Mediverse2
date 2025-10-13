import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  // 🎓 Academic info
  batch: String,
  department: String,
  cgpa: Number,

  // 💡 Skills + Interests
  skills: {
    type: [String],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },

  // 🏆 Achievements
  achievements: {
    type: [String],
    default: [],
  },
  certifications: {
    type: [String],
    default: [],
  },
  hackathons: {
    type: [String],
    default: [],
  },
  publications: {
    type: [String],
    default: [],
  },

  // 🌐 Integrations
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  portfolio: { type: String, default: "" },

  // 👨‍💻 CP/Dev Stats
  leetcode: {
    username: { type: String, default: "" },
    stats: {
      totalSolved: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
    },
  },
  codeforces: {
    handle: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
  },

  // 🎭 Extra-curricular
  extracurriculars: {
    type: [String],
    default: [],
  },

  // 🖼 Avatar / Cover
  avatar: { type: String, default: "" },
  coverImage: { type: String, default: "" },

}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
