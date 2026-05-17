import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  postMsg: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String, // Added to display names easily on the feed
  },
  likes: {
    count: {
      type: Number,
      default: 0,
    },
    users: {
      type: [String], // Array of user emails
      default: [],
    },
  },
}, { timestamps: true }); // Automatically handles createdAt and updatedAt

const postModel = mongoose.model("posts", postSchema);

export default postModel;