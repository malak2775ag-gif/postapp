import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addComment, likeComment } from "./commentSlice";
import * as ENV from "../config";

// Async thunk for adding a new book
export const addBook = createAsyncThunk(
  "books/addBook",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.API_BASE_URL}/addBook`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to add book");
    }
  }
);

// Async thunk for fetching all books
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.API_BASE_URL}/getBooks`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch books");
    }
  }
);

// Async thunk for deleting a book
export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async ({ id, userEmail }, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.API_BASE_URL}/deleteBook/${id}`, {
        data: { userEmail },
      });
      return id; // Return the ID to filter it out from the state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete book");
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetBooks: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBook.pending, (state) => { state.isLoading = true; })
      .addCase(addBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books.push(action.payload.book);
        state.message = action.payload.message;
      })
      .addCase(addBook.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(fetchBooks.pending, (state) => { state.isLoading = true; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(deleteBook.pending, (state) => { state.isLoading = true; })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Remove the deleted book from the state array immediately
        state.books = state.books.filter((book) => book._id !== action.payload);
        state.message = "Book removed from your shelf.";
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Comment Reducers
      .addCase(addComment.fulfilled, (state, action) => {
        // Ensure string comparison for IDs
        const book = state.books.find((b) => b._id.toString() === action.payload.bookId.toString());
        if (book) {
          if (!book.comments) book.comments = [];
          book.comments.unshift(action.payload.comment);
        }
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        // Use toString() to ensure we are comparing string values
        const book = state.books.find((b) => b._id.toString() === action.payload.bookId.toString());
        if (book && book.comments) {
          const comment = book.comments.find((c) => c._id.toString() === action.payload.commentId.toString());
          if (comment) {
            comment.likes = action.payload.likes;
          }
        }
      });
  },
});

export const { resetBooks } = bookSlice.actions;
export default bookSlice.reducer;