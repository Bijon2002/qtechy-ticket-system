/**
 * Ticket Redux Slice
 * Manages ticket state, list, pagination, and async thunks for CRUD operations.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTicketsAPI,
  createTicketAPI,
  deleteTicketAPI,
  updateTicketAPI,
} from "../../api/ticketAPI";

/**
 * Async Thunk: Fetch all tickets (paginated, filtered)
 */
export const fetchTickets = createAsyncThunk(
  "tickets/fetchAll",
  async (params, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await fetchTicketsAPI(token, params);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch tickets");
    }
  }
);

/**
 * Async Thunk: Create a new ticket
 */
export const createTicket = createAsyncThunk(
  "tickets/create",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await createTicketAPI(token, data);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed to create ticket");
    }
  }
);

/**
 * Async Thunk: Delete a ticket
 */
export const deleteTicket = createAsyncThunk(
  "tickets/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await deleteTicketAPI(token, id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed to delete ticket");
    }
  }
);

/**
 * Async Thunk: Update a ticket
 */
export const updateTicket = createAsyncThunk(
  "tickets/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await updateTicketAPI(token, id, data);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed to update ticket");
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    list: [],
    current: null,
    total: 0,
    pages: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.tickets;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Ticket
      .addCase(createTicket.fulfilled, (state, action) => {
        // Prepend the new ticket to the list
        state.list.unshift(action.payload);
      })
      
      // Delete Ticket
      .addCase(deleteTicket.fulfilled, (state, action) => {
        // Remove the deleted ticket from the list
        state.list = state.list.filter((t) => t._id !== action.payload);
      })
      
      // Update Ticket
      .addCase(updateTicket.fulfilled, (state, action) => {
        const idx = state.list.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      });
  },
});

export default ticketSlice.reducer;
