// models/Roadmap.js
import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    roadmap: {
      type: String, // or Array/Object depending on how you store steps
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 reference the User model
      required: true,
    },
  },
  { timestamps: true }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;
