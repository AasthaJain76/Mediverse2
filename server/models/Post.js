import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true, // ensure slug is unique
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "draft"],
    default: "active",
  },
  featuredImage: {
    type: String, // store filename
  },
  featuredImageId: { type: String }, // Cloudinary public_id (for cleanup)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId], // store array of userIds who liked
    ref: 'User',
    default: [],
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ]
}, {
  timestamps: true,
});

const Post = mongoose.model("Post", postSchema);
export default Post;
