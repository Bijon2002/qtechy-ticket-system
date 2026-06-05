/**
 * Auth Redux Slice
 * Manages user authentication state, token storage, and async thunks 
 * for login and registration.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "../../api/authAPI";

// Load initial state from local storage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

/**
 * Async Thunk: Login a user
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (creds, thunkAPI) => {
    try {
      const res = await loginAPI(creds);
      
      // Persist auth data
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", res.data.data.token);
      
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/**
 * Async Thunk: Register a new user
 */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await registerAPI(data);
      
      // Persist auth data upon successful registration
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", res.data.data.token);
      
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user || null,
    token: token || null,
    loading: false,
    error: null,
  },
  reducers: {
    /**
     * Clear auth state and local storage on logout
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
