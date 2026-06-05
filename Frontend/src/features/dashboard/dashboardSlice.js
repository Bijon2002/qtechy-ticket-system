/**
 * Dashboard Redux Slice
 * Manages dashboard statistics state and async thunks.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Async Thunk: Fetch dashboard statistics
 */
export const fetchStats = createAsyncThunk(
  "dashboard/stats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      const res = await axios.get(`${BASE}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch stats");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { 
    stats: null, 
    loading: false 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
