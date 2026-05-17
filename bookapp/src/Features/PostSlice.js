import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";


// Fetch all global posts
export const getPosts = createAsyncThunk("posts/getPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${ENV.API_BASE_URL}/getPosts`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch feed");
  }
});

// Save a new post
export const savePost = createAsyncThunk("posts/savePost", async (postData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${ENV.API_BASE_URL}/savePost`, postData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to share post");
  }
});

// Toggle like on a post
export const likePost = createAsyncThunk("posts/likePost", async ({ postId, email }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${ENV.API_BASE_URL}/likePost/${postId}`, { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || "Interaction failed");
  }
});

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    count: 0,
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetPosts: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => { state.isLoading = true; })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.count = action.payload.count;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.post); // Add new post to the top
        state.count += 1;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        // Ensure string comparison for IDs
        const index = state.posts.findIndex((p) => p._id.toString() === action.payload.post._id.toString());
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
      });
  },
});

export const { resetPosts } = postSlice.actions;
export default postSlice.reducer;