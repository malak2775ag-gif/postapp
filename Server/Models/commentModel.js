import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "books",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
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
  dislikes: {
    count: {
      type: Number,
      default: 0,
    },
    users: {
      type: [String], // Array of user emails
      default: [],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const commentModel = mongoose.model("comments", commentSchema);

export default commentModel;