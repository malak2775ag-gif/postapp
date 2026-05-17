import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";
// Async thunk for registering a user
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Send userData as a plain JSON object
      const response = await axios.post(`${ENV.API_BASE_URL}/registerUser`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
    }
  }
);

// Async thunk for logging in a user
export const login = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.API_BASE_URL}/login`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// Async thunk for logging out a user
export const logout = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.API_BASE_URL}/logout`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Logout failed");
    }
  }
);

// Async thunk for updating a user's profile
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      // Extract email from FormData or object
      const email = userData instanceof FormData ? userData.get('email') : userData.email;
      const response = await axios.put(`${ENV.API_BASE_URL}/updateUserProfile/${email}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Update failed");
    }
  }
);

const getSafeUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      return JSON.parse(savedUser);
    }
  } catch (err) {
    return null;
  }
  return null;
};

const initialState = {
  user: getSafeUser(),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.user = action.payload.user; // Store only the user object
        state.message = action.payload.msg;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.user = action.payload.user; // Store only the user object
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("user");
        state.user = null; // Clear user data on successful logout
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;