import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";
// Async thunk for adding a comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ bookId, commentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.API_BASE_URL}/books/${bookId}/comments`, commentData);
      return { bookId, comment: response.data.comment };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to add comment");
    }
  }
);

// Async thunk for liking a comment
export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async ({ bookId, commentId, userEmail }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${ENV.API_BASE_URL}/books/${bookId}/comments/${commentId}/like`, { userEmail });
      return { bookId, commentId, likes: response.data.likes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to like comment");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetComments: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => { state.isLoading = true; })
      .addCase(addComment.fulfilled, (state) => { state.isLoading = false; })
      .addCase(addComment.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
  },
});

export const { resetComments } = commentSlice.actions;
export default commentSlice.reducer;