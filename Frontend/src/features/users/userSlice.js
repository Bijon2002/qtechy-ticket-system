/**
 * User Redux Slice
 * Manages state for user listing and role updates (Admin only).
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersAPI, updateUserRoleAPI } from "../../api/userAPI";

/**
 * Async Thunk: Fetch users
 */
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await fetchUsersAPI(token, params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

/**
 * Async Thunk: Update a user's role
 */
export const updateUserRole = createAsyncThunk(
  "users/updateRole",
  async ({ id, role }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await updateUserRoleAPI(token, id, role);
      // Return the updated ID and user data for reducer handling
      return { id, user: res.data.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user role"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: { 
    list: [], 
    total: 0, 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u._id === action.payload.id);
        if (idx !== -1) {
          // Update the specific user in the list
          state.list[idx] = action.payload.user;
        }
      });
  },
});

export default userSlice.reducer;
